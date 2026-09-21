"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[328],{4604:function(e,t,r){let i,n;r.d(t,{w:function(){return R}});var a=r(1922),o=r(2265),s=r(1448),l=r(4231);let u=new s.Box3,f=new s.Vector3;class c extends s.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new s.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new s.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new s.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new s.InterleavedBufferAttribute(r,3,0)),this.setAttribute("instanceEnd",new s.InterleavedBufferAttribute(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let i=new s.InstancedInterleavedBuffer(r,2*t,1);return this.setAttribute("instanceColorStart",new s.InterleavedBufferAttribute(i,t,0)),this.setAttribute("instanceColorEnd",new s.InterleavedBufferAttribute(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new s.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new s.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),u.setFromBufferAttribute(t),this.boundingBox.union(u))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new s.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let n=0,a=e.count;n<a;n++)f.fromBufferAttribute(e,n),i=Math.max(i,r.distanceToSquared(f)),f.fromBufferAttribute(t,n),i=Math.max(i,r.distanceToSquared(f));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var d=r(9074);class h extends s.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:s.UniformsUtils.clone(s.UniformsUtils.merge([s.UniformsLib.common,s.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${d.i>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let m=d.i>=125?"uv1":"uv2",v=new s.Vector4,p=new s.Vector3,g=new s.Vector3,x=new s.Vector4,y=new s.Vector4,S=new s.Vector4,w=new s.Vector3,_=new s.Matrix4,b=new s.Line3,U=new s.Vector3,E=new s.Box3,M=new s.Sphere,D=new s.Vector4;function B(e,t,r){return D.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),D.multiplyScalar(1/D.w),D.x=n/r.width,D.y=n/r.height,D.applyMatrix4(e.projectionMatrixInverse),D.multiplyScalar(1/D.w),Math.abs(Math.max(D.x,D.y))}class T extends s.Mesh{constructor(e=new c,t=new h({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,n=0,a=t.count;e<a;e++,n+=2)p.fromBufferAttribute(t,e),g.fromBufferAttribute(r,e),i[n]=0===n?0:i[n-1],i[n+1]=i[n]+p.distanceTo(g);let n=new s.InstancedInterleavedBuffer(i,2,1);return e.setAttribute("instanceDistanceStart",new s.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new s.InterleavedBufferAttribute(n,1,1)),this}raycast(e,t){let r,a;let o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let u=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let f=this.matrixWorld,c=this.geometry,d=this.material;if(n=d.linewidth+u,null===c.boundingSphere&&c.computeBoundingSphere(),M.copy(c.boundingSphere).applyMatrix4(f),o)r=.5*n;else{let e=Math.max(l.near,M.distanceToPoint(i.origin));r=B(l,e,d.resolution)}if(M.radius+=r,!1!==i.intersectsSphere(M)){if(null===c.boundingBox&&c.computeBoundingBox(),E.copy(c.boundingBox).applyMatrix4(f),o)a=.5*n;else{let e=Math.max(l.near,E.distanceToPoint(i.origin));a=B(l,e,d.resolution)}E.expandByScalar(a),!1!==i.intersectsBox(E)&&(o?function(e,t){let r=e.matrixWorld,a=e.geometry,o=a.attributes.instanceStart,l=a.attributes.instanceEnd,u=Math.min(a.instanceCount,o.count);for(let a=0;a<u;a++){b.start.fromBufferAttribute(o,a),b.end.fromBufferAttribute(l,a),b.applyMatrix4(r);let u=new s.Vector3,f=new s.Vector3;i.distanceSqToSegment(b.start,b.end,f,u),f.distanceTo(u)<.5*n&&t.push({point:f,pointOnLine:u,distance:i.origin.distanceTo(f),object:e,face:null,faceIndex:a,uv:null,[m]:null})}}(this,t):function(e,t,r){let a=t.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,u=e.geometry,f=u.attributes.instanceStart,c=u.attributes.instanceEnd,d=Math.min(u.instanceCount,f.count),h=-t.near;i.at(1,S),S.w=1,S.applyMatrix4(t.matrixWorldInverse),S.applyMatrix4(a),S.multiplyScalar(1/S.w),S.x*=o.x/2,S.y*=o.y/2,S.z=0,w.copy(S),_.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<d;t++){if(x.fromBufferAttribute(f,t),y.fromBufferAttribute(c,t),x.w=1,y.w=1,x.applyMatrix4(_),y.applyMatrix4(_),x.z>h&&y.z>h)continue;if(x.z>h){let e=x.z-y.z,t=(x.z-h)/e;x.lerp(y,t)}else if(y.z>h){let e=y.z-x.z,t=(y.z-h)/e;y.lerp(x,t)}x.applyMatrix4(a),y.applyMatrix4(a),x.multiplyScalar(1/x.w),y.multiplyScalar(1/y.w),x.x*=o.x/2,x.y*=o.y/2,y.x*=o.x/2,y.y*=o.y/2,b.start.copy(x),b.start.z=0,b.end.copy(y),b.end.z=0;let u=b.closestPointToPointParameter(w,!0);b.at(u,U);let d=s.MathUtils.lerp(x.z,y.z,u),v=d>=-1&&d<=1,p=w.distanceTo(U)<.5*n;if(v&&p){b.start.fromBufferAttribute(f,t),b.end.fromBufferAttribute(c,t),b.start.applyMatrix4(l),b.end.applyMatrix4(l);let n=new s.Vector3,a=new s.Vector3;i.distanceSqToSegment(b.start,b.end,a,n),r.push({point:a,pointOnLine:n,distance:i.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,[m]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class A extends c{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let i=0;i<t;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,i=new Float32Array(2*r);if(3===t)for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];else for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5],i[2*n+6]=e[n+6],i[2*n+7]=e[n+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class C extends T{constructor(e=new A,t=new h({color:16777215*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let L=o.forwardRef(function({points:e,color:t=16777215,vertexColors:r,linewidth:i,lineWidth:n,segments:u,dashed:f,...d},m){var v,p;let g=(0,l.D)(e=>e.size),x=o.useMemo(()=>u?new T:new C,[u]),[y]=o.useState(()=>new h),S=(null==r||null==(v=r[0])?void 0:v.length)===4?4:3,w=o.useMemo(()=>{let i=u?new c:new A,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(n.flat()),r){t=16777215;let e=r.map(e=>e instanceof s.Color?e.toArray():e);i.setColors(e.flat(),S)}return i},[e,u,r,S]);return o.useLayoutEffect(()=>{x.computeLineDistances()},[e,x]),o.useLayoutEffect(()=>{f?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[f,y]),o.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),o.createElement("primitive",(0,a.Z)({object:x,ref:m},d),o.createElement("primitive",{object:w,attach:"geometry"}),o.createElement("primitive",(0,a.Z)({object:y,attach:"material",color:t,vertexColors:!!r,resolution:[g.width,g.height],linewidth:null!==(p=null!=i?i:n)&&void 0!==p?p:1,dashed:f,transparent:4===S},d)))}),R=o.forwardRef(({threshold:e=15,geometry:t,...r},i)=>{let n=o.useRef(null);o.useImperativeHandle(i,()=>n.current,[]);let l=o.useMemo(()=>[0,0,0,1,0,0],[]),u=o.useRef(),f=o.useRef();return o.useLayoutEffect(()=>{let r=n.current.parent,i=null!=t?t:null==r?void 0:r.geometry;if(!i||u.current===i&&f.current===e)return;u.current=i,f.current=e;let a=new s.EdgesGeometry(i,e).attributes.position.array;n.current.geometry.setPositions(a),n.current.geometry.attributes.instanceStart.needsUpdate=!0,n.current.geometry.attributes.instanceEnd.needsUpdate=!0,n.current.computeLineDistances()}),o.createElement(L,(0,a.Z)({segments:!0,points:l,ref:n,raycast:()=>null},r))})},3867:function(e,t,r){r.d(t,{Q:function(){return c}});var i=r(1922),n=r(2265),a=r(1448),o=r(4231),s=r(4573);class l extends a.ShaderMaterial{constructor(e=new a.Vector2){super({uniforms:{inputBuffer:new a.Uniform(null),depthBuffer:new a.Uniform(null),resolution:new a.Uniform(new a.Vector2),texelSize:new a.Uniform(new a.Vector2),halfTexelSize:new a.Uniform(new a.Vector2),kernel:new a.Uniform(0),scale:new a.Uniform(1),cameraNear:new a.Uniform(0),cameraFar:new a.Uniform(1),minDepthThreshold:new a.Uniform(0),maxDepthThreshold:new a.Uniform(1),depthScale:new a.Uniform(0),depthToBlurRatioBias:new a.Uniform(.25)},fragmentShader:`#include <common>
        #include <dithering_pars_fragment>      
        uniform sampler2D inputBuffer;
        uniform sampler2D depthBuffer;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          float depthFactor = 0.0;
          
          #ifdef USE_DEPTH
            vec4 depth = texture2D(depthBuffer, vUv);
            depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
            depthFactor *= depthScale;
            depthFactor = max(0.0, min(1.0, depthFactor + 0.25));
          #endif
          
          vec4 sum = texture2D(inputBuffer, mix(vUv0, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv1, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv2, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv3, vUv, depthFactor));
          gl_FragColor = sum * 0.25 ;

          #include <dithering_fragment>
          #include <tonemapping_fragment>
          #include <${s.i>=154?"colorspace_fragment":"encodings_fragment"}>
        }`,vertexShader:`uniform vec2 texelSize;
        uniform vec2 halfTexelSize;
        uniform float kernel;
        uniform float scale;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          vec2 uv = position.xy * 0.5 + 0.5;
          vUv = uv;

          vec2 dUv = (texelSize * vec2(kernel) + halfTexelSize) * scale;
          vUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);
          vUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);
          vUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);
          vUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);

          gl_Position = vec4(position.xy, 1.0, 1.0);
        }`,blending:a.NoBlending,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t),this.uniforms.halfTexelSize.value.set(e,t).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class u{constructor({gl:e,resolution:t,width:r=500,height:i=500,minDepthThreshold:n=0,maxDepthThreshold:o=1,depthScale:s=0,depthToBlurRatioBias:u=.25}){this.renderToScreen=!1,this.renderTargetA=new a.WebGLRenderTarget(t,t,{minFilter:a.LinearFilter,magFilter:a.LinearFilter,stencilBuffer:!1,depthBuffer:!1,type:a.HalfFloatType}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new l,this.convolutionMaterial.setTexelSize(1/r,1/i),this.convolutionMaterial.setResolution(new a.Vector2(r,i)),this.scene=new a.Scene,this.camera=new a.Camera,this.convolutionMaterial.uniforms.minDepthThreshold.value=n,this.convolutionMaterial.uniforms.maxDepthThreshold.value=o,this.convolutionMaterial.uniforms.depthScale.value=s,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=u,this.convolutionMaterial.defines.USE_DEPTH=s>0;let f=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),c=new Float32Array([0,0,2,0,0,2]),d=new a.BufferGeometry;d.setAttribute("position",new a.BufferAttribute(f,3)),d.setAttribute("uv",new a.BufferAttribute(c,2)),this.screen=new a.Mesh(d,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,t,r){let i,n,a;let o=this.scene,s=this.camera,l=this.renderTargetA,u=this.renderTargetB,f=this.convolutionMaterial,c=f.uniforms;c.depthBuffer.value=t.depthTexture;let d=f.kernel,h=t;for(n=0,a=d.length-1;n<a;++n)i=(1&n)==0?l:u,c.kernel.value=d[n],c.inputBuffer.value=h.texture,e.setRenderTarget(i),e.render(o,s),h=i;c.kernel.value=d[n],c.inputBuffer.value=h.texture,e.setRenderTarget(this.renderToScreen?null:r),e.render(o,s)}}class f extends a.MeshStandardMaterial{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var t;null!=(t=e.defines)&&t.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${e.vertexShader}`,e.vertexShader=e.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),e.fragmentShader=`
        uniform sampler2D tDiffuse;
        uniform sampler2D tDiffuseBlur;
        uniform sampler2D tDepth;
        uniform sampler2D distortionMap;
        uniform float distortion;
        uniform float cameraNear;
			  uniform float cameraFar;
        uniform bool hasBlur;
        uniform float mixBlur;
        uniform float mirror;
        uniform float mixStrength;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float mixContrast;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec4 my_vUv;
        ${e.fragmentShader}`,e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>

      float distortionFactor = 0.0;
      #ifdef USE_DISTORTION
        distortionFactor = texture2D(distortionMap, vUv).r * distortion;
      #endif

      vec4 new_vUv = my_vUv;
      new_vUv.x += distortionFactor;
      new_vUv.y += distortionFactor;

      vec4 base = texture2DProj(tDiffuse, new_vUv);
      vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);

      vec4 merge = base;

      #ifdef USE_NORMALMAP
        vec2 normal_uv = vec2(0.0);
        vec4 normalColor = texture2D(normalMap, vUv * normalScale);
        vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
        vec3 coord = new_vUv.xyz / new_vUv.w;
        normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
        vec4 base_normal = texture2D(tDiffuse, normal_uv);
        vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
        merge = base_normal;
        blur = blur_normal;
      #endif

      float depthFactor = 0.0001;
      float blurFactor = 0.0;

      #ifdef USE_DEPTH
        vec4 depth = texture2DProj(tDepth, new_vUv);
        depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
        depthFactor *= depthScale;
        depthFactor = max(0.0001, min(1.0, depthFactor));

        #ifdef USE_BLUR
          blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
          merge = merge * min(1.0, depthFactor + 0.5);
        #else
          merge = merge * depthFactor;
        #endif

      #endif

      float reflectorRoughnessFactor = roughness;
      #ifdef USE_ROUGHNESSMAP
        vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
        reflectorRoughnessFactor *= reflectorTexelRoughness.g;
      #endif

      #ifdef USE_BLUR
        blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
        merge = mix(merge, blur, blurFactor);
      #endif

      vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
      newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
      newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
      newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;

      diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}}let c=n.forwardRef(({mixBlur:e=0,mixStrength:t=1,resolution:r=256,blur:s=[0,0],minDepthThreshold:l=.9,maxDepthThreshold:c=1,depthScale:d=0,depthToBlurRatioBias:h=.25,mirror:m=0,distortion:v=1,mixContrast:p=1,distortionMap:g,reflectorOffset:x=0,...y},S)=>{(0,o.e)({MeshReflectorMaterialImpl:f});let w=(0,o.D)(({gl:e})=>e),_=(0,o.D)(({camera:e})=>e),b=(0,o.D)(({scene:e})=>e),U=(s=Array.isArray(s)?s:[s,s])[0]+s[1]>0,E=n.useRef(null);n.useImperativeHandle(S,()=>E.current,[]);let[M]=n.useState(()=>new a.Plane),[D]=n.useState(()=>new a.Vector3),[B]=n.useState(()=>new a.Vector3),[T]=n.useState(()=>new a.Vector3),[A]=n.useState(()=>new a.Matrix4),[C]=n.useState(()=>new a.Vector3(0,0,-1)),[L]=n.useState(()=>new a.Vector4),[R]=n.useState(()=>new a.Vector3),[z]=n.useState(()=>new a.Vector3),[P]=n.useState(()=>new a.Vector4),[F]=n.useState(()=>new a.Matrix4),[O]=n.useState(()=>new a.PerspectiveCamera),V=n.useCallback(()=>{var e;let t=E.current.parent||(null==(e=E.current)?void 0:e.__r3f.parent);if(!t||(B.setFromMatrixPosition(t.matrixWorld),T.setFromMatrixPosition(_.matrixWorld),A.extractRotation(t.matrixWorld),D.set(0,0,1),D.applyMatrix4(A),B.addScaledVector(D,x),R.subVectors(B,T),R.dot(D)>0))return;R.reflect(D).negate(),R.add(B),A.extractRotation(_.matrixWorld),C.set(0,0,-1),C.applyMatrix4(A),C.add(T),z.subVectors(B,C),z.reflect(D).negate(),z.add(B),O.position.copy(R),O.up.set(0,1,0),O.up.applyMatrix4(A),O.up.reflect(D),O.lookAt(z),O.far=_.far,O.updateMatrixWorld(),O.projectionMatrix.copy(_.projectionMatrix),F.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),F.multiply(O.projectionMatrix),F.multiply(O.matrixWorldInverse),F.multiply(t.matrixWorld),M.setFromNormalAndCoplanarPoint(D,B),M.applyMatrix4(O.matrixWorldInverse),L.set(M.normal.x,M.normal.y,M.normal.z,M.constant);let r=O.projectionMatrix;P.x=(Math.sign(L.x)+r.elements[8])/r.elements[0],P.y=(Math.sign(L.y)+r.elements[9])/r.elements[5],P.z=-1,P.w=(1+r.elements[10])/r.elements[14],L.multiplyScalar(2/L.dot(P)),r.elements[2]=L.x,r.elements[6]=L.y,r.elements[10]=L.z+1,r.elements[14]=L.w},[_,x]),[I,N,H,j]=n.useMemo(()=>{let i={minFilter:a.LinearFilter,magFilter:a.LinearFilter,type:a.HalfFloatType},n=new a.WebGLRenderTarget(r,r,i);n.depthBuffer=!0,n.depthTexture=new a.DepthTexture(r,r),n.depthTexture.format=a.DepthFormat,n.depthTexture.type=a.UnsignedShortType;let o=new a.WebGLRenderTarget(r,r,i),f=new u({gl:w,resolution:r,width:s[0],height:s[1],minDepthThreshold:l,maxDepthThreshold:c,depthScale:d,depthToBlurRatioBias:h}),x={mirror:m,textureMatrix:F,mixBlur:e,tDiffuse:n.texture,tDepth:n.depthTexture,tDiffuseBlur:o.texture,hasBlur:U,mixStrength:t,minDepthThreshold:l,maxDepthThreshold:c,depthScale:d,depthToBlurRatioBias:h,distortion:v,distortionMap:g,mixContrast:p,"defines-USE_BLUR":U?"":void 0,"defines-USE_DEPTH":d>0?"":void 0,"defines-USE_DISTORTION":g?"":void 0};return[n,o,f,x]},[w,s,F,r,m,U,e,t,l,c,d,h,v,g,p]);return(0,o.F)(()=>{var e;let t=E.current.parent||(null==(e=E.current)?void 0:e.__r3f.parent);if(!t)return;t.visible=!1;let r=w.xr.enabled,i=w.shadowMap.autoUpdate;V(),w.xr.enabled=!1,w.shadowMap.autoUpdate=!1,w.setRenderTarget(I),w.state.buffers.depth.setMask(!0),w.autoClear||w.clear(),w.render(b,O),U&&H.render(w,I,N),w.xr.enabled=r,w.shadowMap.autoUpdate=i,t.visible=!0,w.setRenderTarget(null)}),n.createElement("meshReflectorMaterialImpl",(0,i.Z)({attach:"material",key:"key"+j["defines-USE_BLUR"]+j["defines-USE_DEPTH"]+j["defines-USE_DISTORTION"],ref:E},j,y))})},697:function(e,t,r){r.d(t,{q:function(){return d}});var i=r(1922),n=r(2265),a=r(1448),o=r(9074),s=Object.defineProperty,l=(e,t,r)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,u=(e,t,r)=>(l(e,"symbol"!=typeof t?t+"":t,r),r);let f=(()=>{let e={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new a.Vector3},up:{value:new a.Vector3(0,1,0)}},vertexShader:`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      uniform vec3 up;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
        zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
        return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
        float c = ( 0.2 * T ) * 10E-18;
        return 0.434 * c * MieConst;
      }

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position.z = gl_Position.w; // set z to camera.far

        vSunDirection = normalize( sunPosition );

        vSunE = sunIntensity( dot( vSunDirection, up ) );

        vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

        float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
        vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
        vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,fragmentShader:`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      uniform float mieDirectionalG;
      uniform vec3 up;

      const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
        return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
        float g2 = pow( g, 2.0 );
        float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
        return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      void main() {

        vec3 direction = normalize( vWorldPosition - cameraPos );

      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
        float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
        float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
        float sR = rayleighZenithLength * inverse;
        float sM = mieZenithLength * inverse;

      // combined extinction factor
        vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
        float cosTheta = dot( direction, vSunDirection );

        float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
        vec3 betaRTheta = vBetaR * rPhase;

        float mPhase = hgPhase( cosTheta, mieDirectionalG );
        vec3 betaMTheta = vBetaM * mPhase;

        vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
        Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
        float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
        float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
        vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
        vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
        float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
        L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

        vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

        vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

        gl_FragColor = vec4( retColor, 1.0 );

      #include <tonemapping_fragment>
      #include <${o.i>=154?"colorspace_fragment":"encodings_fragment"}>

      }
    `},t=new a.ShaderMaterial({name:"SkyShader",fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:a.UniformsUtils.clone(e.uniforms),side:a.BackSide,depthWrite:!1});class r extends a.Mesh{constructor(){super(new a.BoxGeometry(1,1,1),t)}}return u(r,"SkyShader",e),u(r,"material",t),r})();function c(e,t,r=new a.Vector3){let i=2*Math.PI*(t-.5);return r.x=Math.cos(i),r.y=Math.sin(Math.PI*(e-.5)),r.z=Math.sin(i),r}let d=n.forwardRef(({inclination:e=.6,azimuth:t=.1,distance:r=1e3,mieCoefficient:o=.005,mieDirectionalG:s=.8,rayleigh:l=.5,turbidity:u=10,sunPosition:d=c(e,t),...h},m)=>{let v=n.useMemo(()=>new a.Vector3().setScalar(r),[r]),[p]=n.useState(()=>new f);return n.createElement("primitive",(0,i.Z)({object:p,ref:m,"material-uniforms-mieCoefficient-value":o,"material-uniforms-mieDirectionalG-value":s,"material-uniforms-rayleigh-value":l,"material-uniforms-sunPosition-value":d,"material-uniforms-turbidity-value":u,scale:v},h))})},9344:function(e,t,r){let i;r.d(t,{x:function(){return c}});var n=r(7437),a=r(1448),o=r(2265),s=r(4231),l=r(8906);let u=(0,o.createContext)(null),f=e=>(e.getAttributes()&l.VB.CONVOLUTION)===l.VB.CONVOLUTION,c=o.memo((0,o.forwardRef)(({children:e,camera:t,scene:r,resolutionScale:c,enabled:d=!0,renderPriority:h=1,autoClear:m=!0,depthBuffer:v,enableNormalPass:p,stencilBuffer:g,multisampling:x=8,frameBufferType:y=a.HalfFloatType},S)=>{let{gl:w,scene:_,camera:b,size:U}=(0,s.D)(),E=r||_,M=t||b,[D,B,T]=(0,o.useMemo)(()=>{let e=function(){var e;if(void 0!==i)return i;try{let t;let r=document.createElement("canvas");return i=!!(window.WebGL2RenderingContext&&(t=r.getContext("webgl2"))),t&&(null==(e=t.getExtension("WEBGL_lose_context"))||e.loseContext()),i}catch(e){return i=!1}}(),t=new l.xC(w,{depthBuffer:v,stencilBuffer:g,multisampling:x>0&&e?x:0,frameBufferType:y});t.addPass(new l.CD(E,M));let r=null,n=null;return p&&((n=new l.gh(E,M)).enabled=!1,t.addPass(n),void 0!==c&&e&&((r=new l.xs({normalBuffer:n.texture,resolutionScale:c})).enabled=!1,t.addPass(r))),[t,n,r]},[M,w,v,g,x,y,E,p,c]);(0,o.useEffect)(()=>null==D?void 0:D.setSize(U.width,U.height),[D,U]),(0,s.F)((e,t)=>{if(d){let e=w.autoClear;w.autoClear=m,g&&!m&&w.clearStencil(),D.render(t),w.autoClear=e}},d?h:0);let A=(0,o.useRef)(null),C=(0,s.A)(A);(0,o.useLayoutEffect)(()=>{let e=[];if(A.current&&C.current&&D){let t=C.current.objects;for(let r=0;r<t.length;r++){let i=t[r];if(i instanceof l.Qm){let n=[i];if(!f(i)){let e=null;for(;(e=t[r+1])instanceof l.Qm&&!f(e);)n.push(e),r++}let a=new l.H5(M,...n);e.push(a)}else i instanceof l.w2&&e.push(i)}for(let t of e)null==D||D.addPass(t);B&&(B.enabled=!0),T&&(T.enabled=!0)}return()=>{for(let t of e)null==D||D.removePass(t);B&&(B.enabled=!1),T&&(T.enabled=!1)}},[D,e,M,B,T,C]),(0,o.useEffect)(()=>{let e=w.toneMapping;return w.toneMapping=a.NoToneMapping,()=>{w.toneMapping=e}},[]);let L=(0,o.useMemo)(()=>({composer:D,normalPass:B,downSamplingPass:T,resolutionScale:c,camera:M,scene:E}),[D,B,T,c,M,E]);return(0,o.useImperativeHandle)(S,()=>D,[D]),(0,n.jsx)(u.Provider,{value:L,children:(0,n.jsx)("group",{ref:A,children:e})})}))},5163:function(e,t,r){r.d(t,{d:function(){return n}});var i=r(8906);let n=(0,r(8176).p1)(i.rk,{blendFunction:i.YQ.ADD})},4606:function(e,t,r){r.d(t,{s:function(){return n}});var i=r(8906);let n=(0,r(8176).p1)(i.Dd)},8176:function(e,t,r){r.d(t,{p1:function(){return l}});var i=r(7437),n=r(2265),a=r(4231);let o=0,s=new WeakMap,l=(e,t)=>n.forwardRef(function({blendFunction:r=null==t?void 0:t.blendFunction,opacity:l=null==t?void 0:t.opacity,...u},f){let c=s.get(e);if(!c){let t=`@react-three/postprocessing/${e.name}-${o++}`;(0,a.e)({[t]:e}),s.set(e,c=t)}let d=(0,a.D)(e=>e.camera),h=n.useMemo(()=>{var e,r;return[...null!=(e=null==t?void 0:t.args)?e:[],...null!=(r=u.args)?r:[{...t,...u}]]},[JSON.stringify(u)]);return(0,i.jsx)(c,{camera:d,"blendMode-blendFunction":r,"blendMode-opacity-value":l,...u,ref:f,args:h})})},9074:function(e,t,r){r.d(t,{i:function(){return i}});let i=parseInt(r(1448).REVISION.replace(/\D+/g,""))}}]);