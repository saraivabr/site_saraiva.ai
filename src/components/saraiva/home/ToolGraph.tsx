"use client";

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { ArrowRight, Maximize2, Network } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CatalogTool } from "@/components/saraiva/catalog/data";

const MAX_TOOL_NODES = 64;
const MAX_TAG_NODES = 10;

type GraphNode = SimulationNodeDatum & {
  id: string;
  kind: "root" | "tag" | "tool";
  label: string;
  tagSlug?: string;
  tool?: CatalogTool;
  count?: number;
};

type GraphLink = SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode;
  target: string | GraphNode;
};

function nodeId(node: string | GraphNode) {
  return typeof node === "string" ? node : node.id;
}

function buildGraph(tools: CatalogTool[]) {
  const tagCounts = new Map<string, { name: string; count: number }>();
  for (const tool of tools) {
    for (const tag of tool.tags) {
      const current = tagCounts.get(tag.slug);
      tagCounts.set(tag.slug, { name: tag.name, count: (current?.count ?? 0) + 1 });
    }
  }

  const graphTags = [...tagCounts.entries()]
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, MAX_TAG_NODES);
  const allowedTags = new Set(graphTags.map(([slug]) => slug));
  const connectedTools = tools
    .filter((tool) => tool.tags.some((tag) => allowedTags.has(tag.slug)))
    .sort((a, b) => Number(Boolean(b.screenshot_url)) - Number(Boolean(a.screenshot_url)))
    .slice(0, MAX_TOOL_NODES);

  const nodes: GraphNode[] = [
    { id: "root", kind: "root", label: "saraiva.ai", fx: 0, fy: 0 },
    ...graphTags.map(([slug, tag]) => ({
      id: `tag:${slug}`,
      kind: "tag" as const,
      label: tag.name,
      tagSlug: slug,
      count: tag.count,
    })),
    ...connectedTools.map((tool) => ({
      id: `tool:${tool.id}`,
      kind: "tool" as const,
      label: tool.name,
      tool,
    })),
  ];
  const links: GraphLink[] = [];

  for (const [slug] of graphTags) {
    links.push({ source: "root", target: `tag:${slug}` });
  }
  for (const tool of connectedTools) {
    for (const tag of tool.tags.filter((item) => allowedTags.has(item.slug)).slice(0, 2)) {
      links.push({ source: `tag:${tag.slug}`, target: `tool:${tool.id}` });
    }
  }

  return { nodes, links, tools: connectedTools, tagCount: graphTags.length };
}

function radiusFor(node: GraphNode) {
  if (node.kind === "root") return 12;
  if (node.kind === "tag") return 7 + Math.min(5, (node.count ?? 0) / 35);
  return 3.6;
}

function jostleNodes(nodes: GraphNode[]) {
  for (const node of nodes) {
    if (node.kind !== "root") {
      node.x = (Math.random() - 0.5) * 80;
      node.y = (Math.random() - 0.5) * 80;
      node.vx = 0;
      node.vy = 0;
    }
  }
}

export function ToolGraph({ tools, onSelectTag }: { tools: CatalogTool[]; onSelectTag: (tagSlug: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const draggingRef = useRef<GraphNode | null>(null);
  const pointerOriginRef = useRef({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const graph = useMemo(() => buildGraph(tools), [tools]);

  const selectedNode = useMemo(
    () => graph.nodes.find((node) => node.id === selectedId) ?? graph.nodes.find((node) => node.kind === "tool") ?? null,
    [graph.nodes, selectedId],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const { width, height, dpr } = sizeRef.current;
    if (!width || !height) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const gradient = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, width * 0.65);
    gradient.addColorStop(0, "#142c4a");
    gradient.addColorStop(0.46, "#0c1827");
    gradient.addColorStop(1, "#090d13");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(width / 2, height / 2);
    const activeId = hoveredRef.current ?? selectedRef.current;

    for (const link of linksRef.current) {
      const source = link.source as GraphNode;
      const target = link.target as GraphNode;
      if (source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) continue;
      const isActive = activeId === source.id || activeId === target.id;
      context.beginPath();
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
      context.strokeStyle = isActive ? "rgba(77, 207, 251, .8)" : "rgba(147, 173, 205, .14)";
      context.lineWidth = isActive ? 1.25 : 0.65;
      context.stroke();
    }

    const sortedNodes = [...nodesRef.current].sort((a, b) => Number(a.id === activeId) - Number(b.id === activeId));
    for (const node of sortedNodes) {
      if (node.x === undefined || node.y === undefined) continue;
      const active = node.id === activeId;
      const radius = radiusFor(node) + (active ? 3 : 0);
      if (active) {
        context.beginPath();
        context.arc(node.x, node.y, radius + 7, 0, Math.PI * 2);
        context.fillStyle = "rgba(32, 111, 246, .17)";
        context.fill();
      }
      context.beginPath();
      context.arc(node.x, node.y, radius, 0, Math.PI * 2);
      context.fillStyle = node.kind === "root" ? "#206ff6" : node.kind === "tag" ? "#4dcffb" : active ? "#ffffff" : "rgba(225, 237, 250, .78)";
      context.fill();

      if (node.kind !== "tool" || active) {
        context.font = `${node.kind === "root" ? 700 : 600} ${node.kind === "root" ? 14 : 10}px Inter, sans-serif`;
        context.fillStyle = node.kind === "root" ? "#ffffff" : active ? "#ffffff" : "rgba(217, 231, 247, .72)";
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillText(node.label, node.x, node.y + radius + 7, node.kind === "root" ? 140 : 120);
      }
    }
    context.restore();
  }, []);

  useEffect(() => {
    selectedRef.current = selectedNode?.id ?? null;
    draw();
  }, [draw, selectedNode?.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame || !graph.nodes.length) return;

    const simulationNodes = graph.nodes.map((node) => ({ ...node }));
    const simulationLinks = graph.links.map((link) => ({ source: nodeId(link.source), target: nodeId(link.target) }));
    nodesRef.current = simulationNodes;
    linksRef.current = simulationLinks;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const simulation = forceSimulation<GraphNode>(simulationNodes)
      .force("link", forceLink<GraphNode, GraphLink>(simulationLinks).id((node) => node.id).distance((link) => nodeId(link.source) === "root" ? 105 : 58).strength(0.55))
      .force("charge", forceManyBody<GraphNode>().strength((node) => node.kind === "root" ? -480 : node.kind === "tag" ? -175 : -34))
      .force("center", forceCenter<GraphNode>(0, 0).strength(0.08))
      .force("collision", forceCollide<GraphNode>().radius((node) => radiusFor(node) + (node.kind === "tool" ? 4 : 16)).strength(0.9))
      .alphaDecay(reducedMotion ? 0.18 : 0.045)
      .on("tick", draw);
    simulationRef.current = simulation;

    if (reducedMotion) simulation.tick(120).stop();

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width: rect.width, height: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    resize();

    return () => {
      observer.disconnect();
      simulation.stop();
    };
  }, [draw, graph]);

  function locateNode(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    let nearest: GraphNode | null = null;
    let nearestDistance = 22;
    for (const node of nodesRef.current) {
      if (node.x === undefined || node.y === undefined) continue;
      const distance = Math.hypot(node.x - x, node.y - y);
      if (distance < nearestDistance) {
        nearest = node;
        nearestDistance = distance;
      }
    }
    return { node: nearest, x, y };
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const { node, x, y } = locateNode(event);
    if (draggingRef.current) {
      draggingRef.current.fx = x;
      draggingRef.current.fy = y;
      draw();
      return;
    }
    const nextId = node?.id ?? null;
    if (hoveredRef.current !== nextId) {
      hoveredRef.current = nextId;
      setHoveredId(nextId);
      event.currentTarget.style.cursor = node ? "grab" : "default";
      draw();
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const { node } = locateNode(event);
    if (!node) return;
    pointerOriginRef.current = { x: event.clientX, y: event.clientY };
    draggingRef.current = node;
    node.fx = node.x;
    node.fy = node.y;
    simulationRef.current?.alphaTarget(0.22).restart();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.cursor = "grabbing";
  }

  function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    const node = draggingRef.current;
    if (!node) return;
    const moved = Math.hypot(event.clientX - pointerOriginRef.current.x, event.clientY - pointerOriginRef.current.y);
    if (node.kind !== "root") {
      node.fx = null;
      node.fy = null;
    }
    simulationRef.current?.alphaTarget(0);
    draggingRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.style.cursor = "grab";
    if (moved < 7) {
      if (node.kind === "tag" && node.tagSlug) {
        onSelectTag(node.tagSlug);
        window.setTimeout(() => document.getElementById("lista-completa")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 40);
      } else if (node.kind === "root") {
        onSelectTag(null);
        window.setTimeout(() => document.getElementById("lista-completa")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 40);
      } else {
        selectedRef.current = node.id;
        setSelectedId(node.id);
      }
    }
  }

  function reorganize() {
    jostleNodes(nodesRef.current);
    simulationRef.current?.alpha(0.95).restart();
  }

  function selectTool(tool: CatalogTool) {
    const id = `tool:${tool.id}`;
    selectedRef.current = id;
    setSelectedId(id);
    draw();
  }

  if (!graph.tools.length) return null;
  const activeTool = selectedNode?.tool ?? graph.tools[0];

  return (
    <section className="mt-10 overflow-hidden border border-[#25354a] bg-[#090d13] text-white" aria-labelledby="tool-map-title">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#4dcffb]">Mapa vivo da base</p>
          <h3 id="tool-map-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">Clique num território. Abra a categoria.</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-white/50 sm:block">{graph.tools.length} ferramentas · {graph.tagCount} territórios</span>
          <a href="#lista-completa" className="inline-flex min-h-11 items-center px-1 text-xs font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4dcffb]">Ver lista completa ↓</a>
          <button type="button" onClick={reorganize} className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-3 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:border-[#4dcffb] hover:text-[#4dcffb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4dcffb]">
            <Maximize2 className="size-3.5" aria-hidden="true" /> Reorganizar
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-[1.55fr_.65fr]">
        <div ref={frameRef} className="relative order-2 h-[330px] min-w-0 border-t border-white/10 sm:h-[470px] lg:order-1 lg:h-[610px] lg:border-r lg:border-t-0">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none"
            role="img"
            aria-label={`Grafo interativo com ${graph.tools.length} ferramentas conectadas a ${graph.tagCount} territórios. Use o painel ao lado para navegar com teclado.`}
            onPointerMove={onPointerMove}
            onPointerLeave={() => { hoveredRef.current = null; setHoveredId(null); draw(); }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/55 backdrop-blur-sm">
            <Network className="size-3 text-[#4dcffb]" aria-hidden="true" /> Círculo azul filtra a lista · centro mostra tudo
          </div>
          {hoveredId ? <span className="sr-only" aria-live="polite">{graph.nodes.find((node) => node.id === hoveredId)?.label}</span> : null}
        </div>
        <aside className="order-1 flex h-[500px] min-h-[430px] flex-col bg-[#0d131d] lg:order-2 lg:h-[610px]" aria-label="Lista integrada ao mapa">
          <div className="border-b border-white/10 p-5 md:p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4dcffb]">Selecionada no mapa</p>
            <div className="mt-4 grid grid-cols-[96px_1fr] gap-4">
              <div className="relative min-h-24 overflow-hidden border border-white/10 bg-white/5">
                {activeTool.screenshot_url ? <Image src={activeTool.screenshot_url} alt={`Tela de ${activeTool.name}`} fill unoptimized sizes="96px" className="object-cover object-top" /> : <Network className="absolute inset-0 m-auto size-7 text-[#4dcffb]" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-[9px] uppercase tracking-[0.1em] text-white/45">{activeTool.tags.slice(0, 2).map((tag) => tag.name).join(" · ") || "Ferramenta"}</p>
                <h4 className="mt-1 truncate text-xl font-semibold tracking-[-0.04em]">{activeTool.name}</h4>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/55">{activeTool.short_description || activeTool.description.replace(/<[^>]+>/g, " ").slice(0, 150)}</p>
              </div>
            </div>
            <Link href={`/tool/${activeTool.slug}`} className="mt-4 inline-flex min-h-10 w-full items-center justify-between border-t border-white/15 pt-3 text-sm font-semibold text-white transition-colors hover:text-[#4dcffb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4dcffb]">
              Abrir página completa <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
            <span>Ferramentas neste mapa</span><span>{graph.tools.length}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:#31445d_transparent]" role="list" aria-label="Ferramentas exibidas no grafo">
            {graph.tools.map((tool, index) => {
              const selected = activeTool.id === tool.id;
              return (
                <button key={tool.id} type="button" aria-pressed={selected} onClick={() => selectTool(tool)} className={`group grid w-full grid-cols-[56px_1fr_22px] items-center gap-3 border-b border-white/[.07] p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#4dcffb] ${selected ? "bg-[#206ff6] text-white" : "text-white/65 hover:bg-white/[.05] hover:text-white"}`}>
                  <span className="relative aspect-[16/11] overflow-hidden bg-white/5">
                    {tool.screenshot_url ? <Image src={tool.screenshot_url} alt="" fill unoptimized sizes="56px" className="object-cover object-top" /> : <Network className="absolute inset-0 m-auto size-4" />}
                  </span>
                  <span className="min-w-0"><span className="block truncate text-xs font-semibold">{tool.name}</span><span className={`mt-1 block truncate font-mono text-[8px] uppercase tracking-[0.08em] ${selected ? "text-white/70" : "text-white/35"}`}>{tool.tags[0]?.name || "Ferramenta"}</span></span>
                  <span className="font-mono text-[9px] tabular-nums opacity-45">{String(index + 1).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
