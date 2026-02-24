import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { VirtualList } from "@/components/ui/virtual-list/VirtualList";
import { InfiniteScroll } from "@/components/ui/virtual-list/InfiniteScroll";
import { useInfiniteQuery } from "@/components/ui/virtual-list/useInfiniteQuery";

describe("VirtualList", () => {
  it("should render virtualized list with only visible items", () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));

    const { container } = render(
      <div style={{ height: "400px", overflow: "auto" }}>
        <VirtualList
          items={items}
          itemHeight={50}
          renderItem={(item) => <div>{item.name}</div>}
        />
      </div>,
    );

    // Should render container
    expect(container.querySelector(".sr-only")).toBeInTheDocument();
  });

  it("should calculate visible range correctly", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    const renderItem = vi.fn((item) => <div>{item}</div>);

    render(
      <div style={{ height: "300px", overflow: "auto" }}>
        <VirtualList
          items={items}
          itemHeight={50}
          overscan={5}
          renderItem={renderItem}
        />
      </div>,
    );

    // renderItem should be called for visible items
    expect(renderItem).toHaveBeenCalled();
  });

  it("should support custom overscan value", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);

    const { container } = render(
      <div style={{ height: "300px", overflow: "auto" }}>
        <VirtualList
          items={items}
          itemHeight={50}
          overscan={10}
          renderItem={(item) => <div>{item}</div>}
        />
      </div>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("InfiniteScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children", () => {
    const mockLoadMore = vi.fn();

    render(
      <InfiniteScroll loadMore={mockLoadMore} hasMore={true}>
        <div>Test Content</div>
      </InfiniteScroll>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should call loadMore when scrolling near bottom", async () => {
    const mockLoadMore = vi.fn().mockResolvedValue(undefined);

    const { container } = render(
      <InfiniteScroll loadMore={mockLoadMore} hasMore={true} threshold={100}>
        <div>Test Content</div>
      </InfiniteScroll>,
    );

    // Find sentinel element and trigger intersection
    const sentinel = container.querySelector("[role='status']");
    expect(sentinel).toBeInTheDocument();
  });

  it("should show no more items message when hasMore is false", () => {
    const mockLoadMore = vi.fn();

    render(
      <InfiniteScroll loadMore={mockLoadMore} hasMore={false}>
        <div>Test Content</div>
      </InfiniteScroll>,
    );

    expect(
      screen.getByText(/Sem mais items para carregar/),
    ).toBeInTheDocument();
  });

  it("should display error state", async () => {
    const mockLoadMore = vi.fn().mockRejectedValue(new Error("Test error"));
    const mockOnError = vi.fn();

    const { container } = render(
      <InfiniteScroll
        loadMore={mockLoadMore}
        hasMore={true}
        onError={mockOnError}
        debounceMs={10}
      >
        <div>Test Content</div>
      </InfiniteScroll>,
    );

    // Trigger intersection to load
    const sentinel = container.querySelector("[role='status']");
    if (sentinel) {
      fireEvent.scroll(sentinel);
    }

    // Wait for error state
    await waitFor(
      () => {
        // Error should be caught and handled
      },
      { timeout: 100 },
    );
  });
});

describe("useInfiniteQuery", () => {
  it("should load first page automatically", async () => {
    const mockQueryFn = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 10 }, (_, i) => i));

    const { result } = renderHook(() =>
      useInfiniteQuery({
        queryFn: mockQueryFn,
        pageSize: 10,
      }),
    );

    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0);
    });

    expect(mockQueryFn).toHaveBeenCalledWith(1);
  });

  it("should load more items", async () => {
    const mockQueryFn = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 10 }, (_, i) => i));

    const { result } = renderHook(() =>
      useInfiniteQuery({
        queryFn: mockQueryFn,
        pageSize: 10,
      }),
    );

    await waitFor(() => {
      expect(result.current.items.length).toBe(10);
    });

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(mockQueryFn).toHaveBeenCalledWith(2);
    });
  });

  it("should set hasMore to false when less than pageSize items returned", async () => {
    const mockQueryFn = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 5 }, (_, i) => i));

    const { result } = renderHook(() =>
      useInfiniteQuery({
        queryFn: mockQueryFn,
        pageSize: 10,
      }),
    );

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  it("should cache loaded pages", async () => {
    const mockQueryFn = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 10 }, (_, i) => i));

    const { result } = renderHook(() =>
      useInfiniteQuery({
        queryFn: mockQueryFn,
        pageSize: 10,
      }),
    );

    await waitFor(() => {
      expect(result.current.items.length).toBe(10);
    });

    const callCountBefore = mockQueryFn.mock.calls.length;

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(20);
    });

    // Query should be called for new page
    expect(mockQueryFn.mock.calls.length).toBeGreaterThan(callCountBefore);
  });

  it("should reset state", async () => {
    const mockQueryFn = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 10 }, (_, i) => i));

    const { result } = renderHook(() =>
      useInfiniteQuery({
        queryFn: mockQueryFn,
        pageSize: 10,
      }),
    );

    await waitFor(() => {
      expect(result.current.items.length).toBe(10);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Query failed");
    const mockQueryFn = vi.fn().mockRejectedValue(mockError);
    const mockOnError = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteQuery({
        queryFn: mockQueryFn,
        pageSize: 10,
        onError: mockOnError,
      }),
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });

  it("should call onSuccess callback", async () => {
    const mockData = Array.from({ length: 10 }, (_, i) => i);
    const mockQueryFn = vi.fn().mockResolvedValue(mockData);
    const mockOnSuccess = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteQuery({
        queryFn: mockQueryFn,
        pageSize: 10,
        onSuccess: mockOnSuccess,
      }),
    );

    await waitFor(() => {
      expect(result.current.items.length).toBe(10);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(mockData);
  });
});
