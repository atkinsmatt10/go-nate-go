# Architecture decisions

- Keep the App Router server-rendered hero, poster-first Mux boundary, factual text, CSS, payment and DonorDrive APIs intact.
- Keep a single Motion runtime. A client LazyMotion provider receives server-rendered children; this does not convert those children to Client Components. Only feature code is deferred with import(), while all m components retain SSR output. Use domMax because merchandise supports drag. Strict mode guards accidental full motion imports.
- Disable native image/link drag on merchandise to let the existing Motion gesture receive pointerup. Preserve normal link activation and mobile touch scrolling.
- Use the existing webpack production pipeline for controlled comparisons. Keep browser, host Node and pnpm fixed; verify cloud Node 22 separately through the preview build.
- Trial TypeScript 7's tsc alongside the legacy compiler API for ESLint. No ignoreBuildErrors bypass. Keep React Compiler only if its measured interaction benefit justifies build/runtime cost.
- Benchmark fixtures are opt-in scripts for localhost only. Application runtime never imports them. All checkout creation is intercepted in browser tests.
