<script lang="ts">
  import { luxExpressionUrl, type LuxExpression } from "@phoxia/lux";
  type LuxState = Extract<LuxExpression,
    | "sleeping"
    | "active"
    | "happy"
    | "thinking"
    | "confused"
    | "worried"
    | "error"
    | "angry"
    | "embarrassed"
    | "celebration">;

  let {
    state = "happy",
    size = 80,
    label = "Lux",
    float = true,
  }: {
    state?: LuxState;
    size?: number;
    label?: string;
    float?: boolean;
  } = $props();
</script>

<span
  class="lux-wrap"
  class:float
  style="width:{size}px;height:{size}px;display:inline-block;flex-shrink:0;"
  aria-hidden="true"
>
  <img
    src={luxExpressionUrl(state).href}
    alt={label}
    width={size}
    height={size}
    draggable="false"
    style="width:100%;height:100%;display:block;"
  />
</span>

<style>
  .lux-wrap {
    filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.35));
  }

  .lux-wrap.float {
    animation: lux-float 4s ease-in-out infinite;
  }

  @keyframes lux-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lux-wrap.float {
      animation: none;
    }
  }
</style>
