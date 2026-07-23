import LiquidPlasmaDemo from "@/components/heliokit/liquid-plasma/LiquidPlasmaDemo"

const liquidImport = `import { LiquidPlasma } from "@/components/heliokit/liquid-plasma/LiquidPlasma"`

const liquidJSXDemo = `<div className="relative h-[600px] w-full overflow-hidden">
      <LiquidPlasma
        speed={0.5}
        density={8}
        swirl={0.15}
        gloss={0.3}
        relief={0.25}
      />
    </div>`

const manualLiquidCode = `import { useEffect, useRef } from 'react'

export interface LiquidPlasmaProps {
  /** Global flow speed of the rainbow bands. */
  speed?: number
  /** Band frequency / detail of the plasma (1–10). */
  density?: number
  /** How much the frosting relief is swirled by the flow. */
  swirl?: number
  /** Fluid viscosity — higher smears the cursor push out further. */
  viscosity?: number
  /** How hard the cursor pushes the fluid. */
  pushStrength?: number
  /** Radius of the cursor push falloff (uv units). */
  pushRadius?: number
  /** How quickly displaced fluid flows back to rest. */
  flowBack?: number
  /** Specular sheen strength along the frosting ridges. */
  gloss?: number
  /** Height of the frosting relief bump-shading. */
  relief?: number
  /** Amount of tiny air-bubble / pore speckle. */
  bubbles?: number
  /** Milky lift toward white. */
  creaminess?: number
  /** Colour saturation. */
  saturation?: number
  /** Overall brightness. */
  brightness?: number
  /** Extra classes for the wrapper. */
  className?: string
}

export const LiquidPlasma = ({
  speed = 0.5,
  density = 8,
  swirl = 0.15,
  viscosity = 0.5,
  pushStrength = 1.0,
  pushRadius = 0.18,
  flowBack = 0.45,
  gloss = 0.3,
  relief = 0.25,
  bubbles = 0.5,
  creaminess = 0.5,
  saturation = 1.0,
  brightness = 1.0,
  className = '',
}: LiquidPlasmaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const liveRef = useRef({
    speed, density, swirl, viscosity, pushStrength, pushRadius,
    flowBack, gloss, relief, bubbles, creaminess, saturation, brightness,
  })
  liveRef.current = {
    speed, density, swirl, viscosity, pushStrength, pushRadius,
    flowBack, gloss, relief, bubbles, creaminess, saturation, brightness,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      antialias: false, alpha: false, depth: false, stencil: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      console.warn('LiquidPlasma: WebGL2 unavailable — CSS fallback shown')
      return
    }

    const VS = \`#version 300 es
      layout(location=0) in vec2 aPos;
      out vec2 vUv;
      void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }\`

    const NOISE = \`
      vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0*fract(p*C.www)-1.0;
        vec3 h = abs(x)-0.5;
        vec3 ox = floor(x+0.5);
        vec3 a0 = x-ox;
        m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);
        vec3 g;
        g.x = a0.x*x0.x + h.x*x0.y;
        g.yz = a0.yz*x12.xz + h.yz*x12.yw;
        return 130.0*dot(m,g);
      }\`

    const SIM_FS = \`#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 frag;
      uniform sampler2D uField;
      uniform vec2 uTexel, uMouse, uMouseVel, uAspect;
      uniform float uDt, uTime, uForce, uRadius, uDamp, uVisc, uAdvect, uRelax, uIdle;
      \${NOISE}
      vec2 curl(vec2 p){
        float e=0.12;
        float a=snoise(p+vec2(0.0,e)), b=snoise(p-vec2(0.0,e));
        float c=snoise(p+vec2(e,0.0)), d=snoise(p-vec2(e,0.0));
        return vec2(a-b, -(c-d))/(2.0*e);
      }
      void main(){
        vec4 F = texture(uField, vUv);
        vec2 vel = F.xy*2.0-1.0;
        vec2 back = vUv - vel*uDt*uAdvect;
        vec2 adv = texture(uField, back).xy*2.0-1.0;
        vec2 nb = ( texture(uField, vUv+vec2(uTexel.x,0.0)).xy
                  + texture(uField, vUv-vec2(uTexel.x,0.0)).xy
                  + texture(uField, vUv+vec2(0.0,uTexel.y)).xy
                  + texture(uField, vUv-vec2(0.0,uTexel.y)).xy )*0.25*2.0-1.0;
        vec2 vNew = mix(adv, nb, uVisc);
        vec2 cp = (vUv-0.5)*uAspect*3.0;
        vNew += curl(cp*0.8 + vec2(0.0, uTime*0.06))*uIdle*uDt;
        vec2 md = (vUv-uMouse)*uAspect;
        float fall = exp(-dot(md,md)/(uRadius*uRadius));
        vNew += uMouseVel*uForce*fall;
        vNew *= uDamp;
        vNew = clamp(vNew, -1.0, 1.0);
        vec2 dAdv = texture(uField, back).zw*2.0-1.0;
        vec2 dNew = (dAdv + vNew*uDt)*uRelax;
        dNew = clamp(dNew, -1.0, 1.0);
        frag = vec4(vNew*0.5+0.5, dNew*0.5+0.5);
      }\`

    const REN_FS = \`#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 frag;
      uniform sampler2D uField;
      uniform vec2 uAspect;
      uniform float uTime, uScale, uSpeed, uWarpAmt, uCream, uSat, uBright, uBands, uSwirl, uGloss, uShine, uRelief, uBubbles;
      uniform int uOct;
      \${NOISE}
      float fbm(vec2 p){
        float a=0.5, s=0.0;
        mat2 m=mat2(1.6,1.2,-1.2,1.6);
        for(int i=0;i<7;i++){ if(i>=uOct) break; s+=a*snoise(p); p=m*p; a*=0.5; }
        return s;
      }
      vec2 warp2(vec2 x){ return vec2(snoise(x), snoise(x + vec2(19.1,7.3))); }
      vec3 palette(float t){
        t = fract(t)*8.0;
        int i = int(floor(t));
        float f = smoothstep(0.0,1.0,fract(t));
        vec3 RED=vec3(0.96,0.26,0.30), ORG=vec3(1.0,0.52,0.16), YEL=vec3(1.0,0.86,0.24);
        vec3 GRN=vec3(0.58,0.80,0.28), CYN=vec3(0.22,0.76,0.82), BLU=vec3(0.32,0.52,0.95);
        vec3 PUR=vec3(0.64,0.47,0.87), PNK=vec3(0.97,0.47,0.62);
        vec3 a,b;
        if(i==0){a=RED;b=ORG;} else if(i==1){a=ORG;b=YEL;} else if(i==2){a=YEL;b=GRN;}
        else if(i==3){a=GRN;b=CYN;} else if(i==4){a=CYN;b=BLU;} else if(i==5){a=BLU;b=PUR;}
        else if(i==6){a=PUR;b=PNK;} else {a=PNK;b=RED;}
        return mix(a,b,f);
      }
      void main(){
        vec2 disp = texture(uField, vUv).zw*2.0-1.0;
        vec2 warp = disp*uWarpAmt;
        vec2 p = (vUv-0.5)*uAspect*uScale + warp;
        float t = uTime*uSpeed;
        vec2 axis = normalize(vec2(-0.35, 0.94));
        p -= axis * t * 0.5;
        vec2 q1 = warp2(p*0.5);
        vec2 q2 = warp2(p*1.0 + 1.2*q1);
        vec2 q = 0.8*q1 + 0.5*q2;
        vec2 sw = p + uSwirl*q;
        float H = snoise(sw*0.55) + 0.2*snoise(sw*1.0);
        vec3 N = normalize(vec3(-dFdx(H)*uRelief, -dFdy(H)*uRelief, 1.0));
        float band = dot(p, axis) * uBands;
        vec3 base = palette(band);
        vec3 Ldir = normalize(vec3(0.45, 0.55, 0.72));
        float diff = clamp(dot(N, Ldir), 0.0, 1.0);
        vec3 col = base * (0.86 + 0.16*diff);
        vec3 Hh = normalize(Ldir + vec3(0.0,0.0,1.0));
        float spec = pow(clamp(dot(N, Hh), 0.0, 1.0), uShine);
        col += spec * uGloss;
        float bb = snoise(sw*20.0);
        col += smoothstep(0.80,0.97, bb) * 0.18 * uBubbles;
        col -= smoothstep(0.80,0.97, -bb) * 0.10 * uBubbles;
        col = mix(col, vec3(1.0), 0.05*uCream);
        float l = dot(col, vec3(0.299,0.587,0.114));
        col = mix(vec3(l), col, uSat);
        col *= uBright;
        float dth = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
        col += (dth-0.5)/300.0;
        frag = vec4(clamp(col,0.0,1.0), 1.0);
      }\`

    const shader = (type: number, source: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, source)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('LiquidPlasma shader', gl.getShaderInfoLog(s))
        return null
      }
      return s
    }

    const program = (vsSrc: string, fsSrc: string) => {
      const vs = shader(gl.VERTEX_SHADER, vsSrc)
      const fs = shader(gl.FRAGMENT_SHADER, fsSrc)
      if (!vs || !fs) return null
      const p = gl.createProgram()!
      gl.attachShader(p, vs)
      gl.attachShader(p, fs)
      gl.linkProgram(p)
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('LiquidPlasma link', gl.getProgramInfoLog(p))
        return null
      }
      return { prog: p, loc: {} as Record<string, WebGLUniformLocation | null> }
    }

    type Prog = { prog: WebGLProgram; loc: Record<string, WebGLUniformLocation | null> }
    const u = (P: Prog, name: string) => {
      if (!(name in P.loc)) P.loc[name] = gl.getUniformLocation(P.prog, name)
      return P.loc[name]
    }

    const simProg = program(VS, SIM_FS)
    const renProg = program(VS, REN_FS)
    if (!simProg || !renProg) return

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.BLEND)

    type Field = { tex: WebGLTexture; fbo: WebGLFramebuffer }
    const target = (tw: number, th: number): Field => {
      const tex = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const fbo = gl.createFramebuffer()!
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      gl.clearColor(0.5, 0.5, 0.5, 0.5)
      gl.clear(gl.COLOR_BUFFER_BIT)
      return { tex, fbo }
    }

    let w = 0
    let h = 0
    let sw = 0
    let sh = 0
    let aspect: [number, number] = [1, 1]
    let fields: [Field, Field] | null = null
    let src = 0

    const createFields = () => {
      if (fields) fields.forEach((f) => { gl.deleteTexture(f.tex); gl.deleteFramebuffer(f.fbo) })
      fields = [target(sw, sh), target(sw, sh)]
      src = 0
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nw = Math.max(2, Math.round(canvas.clientWidth * dpr))
      const nh = Math.max(2, Math.round(canvas.clientHeight * dpr))
      if (nw === w && nh === h) return
      w = nw; h = nh; canvas.width = w; canvas.height = h
      aspect = w >= h ? [w / h, 1] : [1, h / w]
      sw = Math.max(2, Math.round(w * 0.5))
      sh = Math.max(2, Math.round(h * 0.5))
      createFields()
    }
    resize()

    const mouse = { x: 0.5, y: 0.5 }
    const prev = { x: 0.5, y: 0.5 }
    let time = 0
    let last = performance.now()
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / r.width
      mouse.y = 1 - (e.clientY - r.top) / r.height
    }
    const onResize = () => resize()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize)

    const frame = (now: number) => {
      const P = liveRef.current
      let dt = (now - last) / 1000
      last = now
      dt = Math.min(Math.max(dt, 0.0001), 0.033)
      time += dt

      let vx = (mouse.x - prev.x) / dt
      let vy = (mouse.y - prev.y) / dt
      prev.x = mouse.x; prev.y = mouse.y
      const spd = Math.hypot(vx, vy)
      const MX = 4.0
      if (spd > MX) { vx *= MX / spd; vy *= MX / spd }

      const scale = 0.9 + P.density * 0.2
      const oct = Math.min(6, Math.max(3, Math.round(3 + P.density * 0.25)))
      const visc = 0.05 + P.viscosity * 0.35
      const relax = 0.995 - P.flowBack * 0.07
      const idle = 0.0

      const s = fields![src]
      const d = fields![1 - src]
      gl.bindFramebuffer(gl.FRAMEBUFFER, d.fbo)
      gl.viewport(0, 0, sw, sh)
      gl.useProgram(simProg.prog)
      gl.bindVertexArray(vao)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, s.tex)
      gl.uniform1i(u(simProg, 'uField'), 0)
      gl.uniform2f(u(simProg, 'uTexel'), 1 / sw, 1 / sh)
      gl.uniform2f(u(simProg, 'uMouse'), mouse.x, mouse.y)
      gl.uniform2f(u(simProg, 'uMouseVel'), vx, vy)
      gl.uniform2f(u(simProg, 'uAspect'), aspect[0], aspect[1])
      gl.uniform1f(u(simProg, 'uDt'), dt)
      gl.uniform1f(u(simProg, 'uTime'), time)
      gl.uniform1f(u(simProg, 'uForce'), P.pushStrength * 0.95)
      gl.uniform1f(u(simProg, 'uRadius'), P.pushRadius)
      gl.uniform1f(u(simProg, 'uDamp'), 0.985)
      gl.uniform1f(u(simProg, 'uVisc'), visc)
      gl.uniform1f(u(simProg, 'uAdvect'), 1.0)
      gl.uniform1f(u(simProg, 'uRelax'), relax)
      gl.uniform1f(u(simProg, 'uIdle'), idle)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      src = 1 - src

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, w, h)
      gl.useProgram(renProg.prog)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fields![src].tex)
      gl.uniform1i(u(renProg, 'uField'), 0)
      gl.uniform2f(u(renProg, 'uAspect'), aspect[0], aspect[1])
      gl.uniform1f(u(renProg, 'uTime'), time)
      gl.uniform1f(u(renProg, 'uScale'), scale)
      gl.uniform1f(u(renProg, 'uSpeed'), P.speed)
      gl.uniform1f(u(renProg, 'uWarpAmt'), 0.35)
      gl.uniform1f(u(renProg, 'uBands'), 0.06 + P.density * 0.028)
      gl.uniform1f(u(renProg, 'uSwirl'), P.swirl * 0.6)
      gl.uniform1f(u(renProg, 'uGloss'), P.gloss)
      gl.uniform1f(u(renProg, 'uShine'), 34.0)
      gl.uniform1f(u(renProg, 'uRelief'), P.relief * 50.0)
      gl.uniform1f(u(renProg, 'uBubbles'), P.bubbles)
      gl.uniform1f(u(renProg, 'uCream'), P.creaminess)
      gl.uniform1f(u(renProg, 'uSat'), P.saturation)
      gl.uniform1f(u(renProg, 'uBright'), P.brightness)
      gl.uniform1i(u(renProg, 'uOct'), oct)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      if (fields) fields.forEach((f) => { gl.deleteTexture(f.tex); gl.deleteFramebuffer(f.fbo) })
      gl.deleteProgram(simProg.prog)
      gl.deleteProgram(renProg.prog)
    }
  }, [])

  return (
    <div
      className={\`absolute inset-0 h-full w-full overflow-hidden \${className}\`}
      style={{
        background:
          'radial-gradient(60% 55% at 22% 30%, #7b4dff55, transparent 60%),' +
          'radial-gradient(55% 50% at 78% 22%, #ff5fa255, transparent 60%),' +
          'radial-gradient(60% 60% at 30% 82%, #ff7a1a55, transparent 60%),' +
          'radial-gradient(55% 55% at 82% 78%, #3b82f655, transparent 60%),' +
          '#14101c',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        style={{ touchAction: 'none', userSelect: 'none' }}
      />
    </div>
  )
}

export default LiquidPlasma
`

export const PreviewComponent = LiquidPlasmaDemo

export const code = `${liquidImport}

export function LiquidPlasmaDemo() {
  return (
    ${liquidJSXDemo}
  )
}`

export const description = "An interactive WebGL2 fluid-plasma background: dead-straight rainbow frosting bands flow across a glossy, softly-lit relief while a real velocity field lets the cursor push, smear, and release the surface. Falls back to a static CSS gradient without WebGL2. Perfect for hero sections, landing pages, and vivid marketing surfaces."

export const cliSteps = [
  {
    id: 1,
    title: "Add the component",
    commands: ["npx heliokit@latest add liquid-plasma"],
  },
  {
    id: 2,
    title: "Import the module",
    codeSnippets: [
      {
        filename: "components/LiquidPlasmaDemo.tsx",
        language: "tsx",
        code: liquidImport,
      },
    ],
  },
  {
    id: 3,
    title: "Use the component",
    codeSnippets: [
      {
        filename: "components/LiquidPlasmaDemo.tsx",
        language: "tsx",
        code: liquidJSXDemo,
      },
    ],
  },
]

export const manualSteps = [
  {
    id: 1,
    title: "Install dependencies",
    commands: ["npx heliokit@latest init"],
  },
  {
    id: 2,
    title: "Create the LiquidPlasma component",
    codeSnippets: [
      {
        filename: "components/LiquidPlasma.tsx",
        language: "tsx",
        code: manualLiquidCode,
      },
    ],
  },
  {
    id: 3,
    title: "Use it in your app",
    codeSnippets: [
      {
        filename: "pages/index.tsx",
        language: "tsx",
        code: liquidJSXDemo,
      },
    ],
  },
]

export const propsData = [
  {
    componentName: "LiquidPlasma",
    props: [
      { propName: "speed", description: "Global flow speed of the rainbow bands across the surface", type: "number", defaultValue: "0.5" },
      { propName: "density", description: "Band frequency / detail of the plasma (drives stripe count and noise octaves)", type: "number", defaultValue: "8" },
      { propName: "swirl", description: "How much the flow swirls the frosting relief (colour stays straight)", type: "number", defaultValue: "0.15" },
      { propName: "viscosity", description: "Fluid viscosity — higher smears the cursor push out further", type: "number", defaultValue: "0.5" },
      { propName: "pushStrength", description: "How hard the cursor pushes the fluid velocity field", type: "number", defaultValue: "1.0" },
      { propName: "pushRadius", description: "Radius of the cursor push falloff in uv units", type: "number", defaultValue: "0.18" },
      { propName: "flowBack", description: "How quickly displaced fluid relaxes back to rest", type: "number", defaultValue: "0.45" },
      { propName: "gloss", description: "Specular sheen strength along the frosting ridges", type: "number", defaultValue: "0.3" },
      { propName: "relief", description: "Height of the frosting relief bump-shading", type: "number", defaultValue: "0.25" },
      { propName: "bubbles", description: "Amount of tiny air-bubble / pore speckle", type: "number", defaultValue: "0.5" },
      { propName: "creaminess", description: "Milky lift of the colours toward white", type: "number", defaultValue: "0.5" },
      { propName: "saturation", description: "Colour saturation of the plasma", type: "number", defaultValue: "1.0" },
      { propName: "brightness", description: "Overall brightness multiplier", type: "number", defaultValue: "1.0" },
      { propName: "className", description: "Extra CSS classes applied to the absolutely-positioned wrapper", type: "string", defaultValue: '""' },
    ],
  },
]
