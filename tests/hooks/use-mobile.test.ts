import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  let listeners: Record<string, (() => void)[]>;

  beforeEach(() => {
    listeners = {};

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (event: string, handler: () => void) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      },
      removeEventListener: (event: string, handler: () => void) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((h) => h !== handler);
        }
      },
    }));
  });

  it('should return false for desktop width', () => {
    (window as unknown as Record<string, unknown>).innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should return true for mobile width', () => {
    (window as unknown as Record<string, unknown>).innerWidth = 375;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return true at breakpoint boundary (767px)', () => {
    (window as unknown as Record<string, unknown>).innerWidth = 767;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return false at breakpoint (768px)', () => {
    (window as unknown as Record<string, unknown>).innerWidth = 768;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should update when window resizes', () => {
    (window as unknown as Record<string, unknown>).innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      (window as unknown as Record<string, unknown>).innerWidth = 500;
      listeners['change']?.forEach((fn) => fn());
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    (window as unknown as Record<string, unknown>).innerWidth = 1024;

    const { unmount } = renderHook(() => useIsMobile());

    expect(listeners['change']?.length).toBe(1);

    unmount();

    expect(listeners['change']?.length).toBe(0);
  });
});
