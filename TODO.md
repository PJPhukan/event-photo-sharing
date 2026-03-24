Fix the zoom functionality so that the entire canvas frame zooms in and out together with its content:
Current problem:

When clicking + or - zoom buttons, only the content inside the canvas is scaling but the canvas frame/border itself stays the same size
The canvas frame (the visible card boundary with the cyan border) should also grow and shrink with the zoom

How it should work:

At 100% zoom the canvas shows at its natural size (e.g. 500x500 for 1:1)
At 150% zoom the entire canvas frame AND all its content scales up to 750x750 visually
At 50% zoom the entire canvas frame AND all its content scales down to 250x250 visually
The dotted background area around the canvas stays the same size, only the canvas itself zooms
Scrollbars appear in the canvas scroll area when the zoomed canvas is larger than the visible area

Fix:

The zoom should be applied by scaling the entire canvas shell wrapper using CSS transform: scale(zoomLevel) rather than only scaling the fabric.js internal zoom
OR correctly set both fabric.js canvas CSS dimensions AND the wrapper dimensions together so the frame visually grows and shrinks
The canvas shell div that wraps the fabric canvas element should change its actual pixel size based on zoom: width = baseSize.width * zoom, height = baseSize.height * zoom
The fabric.js canvas internal coordinate system stays at baseSize.width x baseSize.height always
Only the CSS visual size of the canvas changes with zoom
At default auto-fit zoom the canvas fits perfectly inside the scroll area with no scrollbar
When user manually zooms in past the auto-fit level, scrollbars appear# Event Card Builder Scroll & Sticky Implementation Plan

## Status: [ ] Not Started

### Steps:
1. [x] Update `client/src/page/EventCardBuilder/event-card-builder.scss` ✅
   - Remove `height: 100vh; overflow: hidden;` from `.event-card-builder`
   - Set `.builder-header { top: var(--topbar-height); }` (below main Topbar)
   - Make `.builder-body { height: auto; min-height calc; align-items: start; }`
   - Add sticky to `.sidebar-shell { position: sticky; top: calc(...); }`
   - Update `.builder-panel { max-height calc; height: auto; flex:1; position: relative; }`
   - Canvas `min-height`; md padding fixed
   - Collapse buttons remain visible (already top corners)

2. [ ] Test page scroll, header stickiness, sidebar stickiness & internal scroll

3. [ ] Verify responsive behavior (md+ breakpoints)

4. [ ] [attempt_completion] Mark complete

**Notes**: Topbar height: 60px base, 80px @md+. No JS changes needed. Pure CSS fixes.
