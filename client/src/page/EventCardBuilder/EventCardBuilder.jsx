import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { fabric } from "fabric";
import { QRCodeCanvas } from "qrcode.react";
import "./event-card-builder.scss";
import { APP_URL } from "../../lib/config";
import { context, dashboad } from "../../../Context/context";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { ChromePicker } from "react-color";
import logo from "../../assets/logo.png";

const CANVAS_SIZES = {
  "1:1": { width: 500, height: 500, label: "1:1 (Square)" },
  "4:3": { width: 800, height: 600, label: "4:3 (Landscape)" },
  "3:4": { width: 600, height: 800, label: "3:4 (Portrait)" },
  "16:9": { width: 800, height: 450, label: "16:9 (Widescreen)" },
  "9:16": { width: 450, height: 800, label: "9:16 (Story)" },
  A4: { width: 595, height: 842, label: "A4 (Portrait)" },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const EventCardBuilder = () => {
  const canvasElementRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const canvasStageRef = useRef(null);
  const canvasScrollRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const qrGroupRef = useRef(null);
  const qrHasBeenMovedRef = useRef(false);
  const qrTransformRef = useRef(null);
  const eventNameRef = useRef(null);
  const eventDateRef = useRef(null);
  const [canvasMode, setCanvasMode] = useState("3:4");
  const [userZoom, setUserZoom] = useState(1);
  const fitScaleRef = useRef(1);
  const [canvasDisplaySize, setCanvasDisplaySize] = useState({
    width: CANVAS_SIZES["3:4"].width,
    height: CANVAS_SIZES["3:4"].height,
  });
  const canvasDisplaySizeRef = useRef({
    width: CANVAS_SIZES["3:4"].width,
    height: CANVAS_SIZES["3:4"].height,
  });
  const [textValue, setTextValue] = useState("Event Title");
  const [imageError, setImageError] = useState("");
  const [imageFileName, setImageFileName] = useState("No file selected");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [qrValue, setQrValue] = useState(`${APP_URL}/event/preview`);
  const [activeTemplate, setActiveTemplate] = useState("clean-light");
  const [qrVersion, setQrVersion] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [selectedDesignId, setSelectedDesignId] = useState("new");
  const [designName, setDesignName] = useState("Untitled");
  const [isDesignDropdownOpen, setIsDesignDropdownOpen] = useState(false);
  const [editingDesignId, setEditingDesignId] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [layersCollapsed, setLayersCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [frameColor, setFrameColor] = useState("#0f111a");
  const [frameWidth, setFrameWidth] = useState(0);
  const [layerContextMenu, setLayerContextMenu] = useState(null);
  const historyRef = useRef({ undo: [], redo: [], isApplying: false, last: null });
  const historyTimeoutRef = useRef(null);
  const dashboardContext = useContext(dashboad);
  const { get_event } = dashboardContext;
  const userContext = useContext(context);
  const { showToast } = userContext;
  const isLoadingDesignRef = useRef(false);
  const [pendingDesign, setPendingDesign] = useState(null);
  const layerIdRef = useRef(0);

  useEffect(() => {
    const savedLeft = window.localStorage.getItem("memois-card-left-collapsed");
    const savedRight = window.localStorage.getItem("memois-card-right-collapsed");
    if (savedLeft === "true") setIsLeftCollapsed(true);
    if (savedRight === "true") setIsRightCollapsed(true);
  }, []);

  useEffect(() => {
    const closeMenu = () => setLayerContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    const savedLayers = window.localStorage.getItem("memois-card-layers-collapsed");
    const savedProps = window.localStorage.getItem("memois-card-props-collapsed");
    if (savedLayers === "true") setLayersCollapsed(true);
    if (savedProps === "true") setPropertiesCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "memois-card-left-collapsed",
      String(isLeftCollapsed)
    );
  }, [isLeftCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(
      "memois-card-right-collapsed",
      String(isRightCollapsed)
    );
  }, [isRightCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(
      "memois-card-layers-collapsed",
      String(layersCollapsed)
    );
  }, [layersCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(
      "memois-card-props-collapsed",
      String(propertiesCollapsed)
    );
  }, [propertiesCollapsed]);


  const templates = [
    { id: "clean-light", name: "Clean Light" },
    { id: "dark-minimal", name: "Dark Minimal" },
    { id: "gradient-glow", name: "Gradient Glow" },
    { id: "soft-pastel", name: "Soft Pastel" },
    { id: "bold-split", name: "Bold Split" },
  ];

  const baseSize = useMemo(() => CANVAS_SIZES[canvasMode], [canvasMode]);
  const previousSizeRef = useRef(baseSize);

  const getCanvasModeFromSize = (size) => {
    if (!size?.width || !size?.height) return "3:4";
    return (
      Object.keys(CANVAS_SIZES).find(
        (key) =>
          CANVAS_SIZES[key].width === size.width &&
          CANVAS_SIZES[key].height === size.height
      ) || "3:4"
    );
  };

  const updateCanvasScale = () => {
    const fabricCanvas = fabricCanvasRef.current;
    const container = canvasScrollRef.current;
    const shell = canvasContainerRef.current;
    const canvasEl = canvasElementRef.current;
    if (!fabricCanvas || !container || !shell || !canvasEl) return;

    const styles = window.getComputedStyle(container);
    const paddingX =
      parseFloat(styles.paddingLeft || "0") +
      parseFloat(styles.paddingRight || "0");
    const paddingY =
      parseFloat(styles.paddingTop || "0") +
      parseFloat(styles.paddingBottom || "0");
    const availableWidth = (container.clientWidth || baseSize.width) - paddingX;
    const availableHeight =
      (container.clientHeight || baseSize.height) - paddingY;

    const fitScale = Math.min(
      availableWidth / baseSize.width,
      availableHeight / baseSize.height
    );
    fitScaleRef.current = Number.isFinite(fitScale) && fitScale > 0 ? fitScale : 1;

    const zoom = clamp(userZoom, 0.2, 3);
    const displayWidth = Math.max(1, baseSize.width * fitScaleRef.current * zoom);
    const displayHeight = Math.max(1, baseSize.height * fitScaleRef.current * zoom);

    // Keep internal coordinate system fixed.
    fabricCanvas.setWidth(baseSize.width);
    fabricCanvas.setHeight(baseSize.height);
    fabricCanvas.setZoom(1);

    // Apply CSS size to canvas and shell (use Fabric to keep pointer math correct).
    fabricCanvas.setDimensions(
      { width: displayWidth, height: displayHeight },
      { cssOnly: true }
    );
    if (fabricCanvas.upperCanvasEl) {
      fabricCanvas.upperCanvasEl.style.pointerEvents = "auto";
      fabricCanvas.upperCanvasEl.style.width = `${displayWidth}px`;
      fabricCanvas.upperCanvasEl.style.height = `${displayHeight}px`;
    }
    if (fabricCanvas.lowerCanvasEl) {
      fabricCanvas.lowerCanvasEl.style.pointerEvents = "auto";
      fabricCanvas.lowerCanvasEl.style.width = `${displayWidth}px`;
      fabricCanvas.lowerCanvasEl.style.height = `${displayHeight}px`;
    }
    canvasEl.style.width = `${displayWidth}px`;
    canvasEl.style.height = `${displayHeight}px`;
    fabricCanvas.calcOffset();
    shell.style.width = `${displayWidth}px`;
    shell.style.height = `${displayHeight}px`;

    if (
      canvasDisplaySizeRef.current.width !== displayWidth ||
      canvasDisplaySizeRef.current.height !== displayHeight
    ) {
      canvasDisplaySizeRef.current = { width: displayWidth, height: displayHeight };
      setCanvasDisplaySize({ width: displayWidth, height: displayHeight });
    }

    fabricCanvas.requestRenderAll();

  };

  const ensureLayerMeta = (obj) => {
    if (!obj) return;
    if (!obj.data) obj.data = {};
    if (!obj.data.id) {
      layerIdRef.current += 1;
      obj.data.id = `layer-${layerIdRef.current}`;
    }
  };

  const buildQrGroup = (fabricCanvas, qrDataUrl, canvasWidth, canvasHeight) => {
    return new Promise((resolve) => {
      if (!qrDataUrl) {
        resolve(null);
        return;
      }
      fabric.Image.fromURL(
        qrDataUrl,
        (img) => {
          const qrSize = canvasWidth * 0.35;
          const scale = qrSize / img.width;
          img.set({
            scaleX: scale,
            scaleY: scale,
          });
          const framePadding = qrSize * 0.1;
          const frame = new fabric.Rect({
            width: img.getScaledWidth() + framePadding * 2,
            height: img.getScaledHeight() + framePadding * 2,
            fill: "#0f111a",
            stroke: "#00D4FF",
            strokeWidth: 2,
            rx: 12,
            ry: 12,
          });

          img.set({
            left: framePadding,
            top: framePadding,
          });

          const group = new fabric.Group([frame, img], {
            left: 0,
            top: 0,
            cornerStyle: "circle",
            cornerColor: "#00D4FF",
            transparentCorners: false,
          });

          group.set("data", { ...group.data, type: "qr" });
          ensureLayerMeta(group);
          group.set({
            selectable: true,
            evented: true,
            lockMovementX: false,
            lockMovementY: false,
            lockScalingX: false,
            lockScalingY: false,
            lockRotation: false,
            hasControls: true,
            hasBorders: true,
          });

          const defaultLeft = canvasWidth / 2 - group.getScaledWidth() / 2;
          const defaultTop = canvasHeight * 0.55;

          if (qrHasBeenMovedRef.current && qrTransformRef.current) {
            group.set({
              left: qrTransformRef.current.left ?? defaultLeft,
              top: qrTransformRef.current.top ?? defaultTop,
              scaleX: qrTransformRef.current.scaleX ?? 1,
              scaleY: qrTransformRef.current.scaleY ?? 1,
              angle: qrTransformRef.current.angle ?? 0,
            });
          } else {
            group.set({
              left: defaultLeft,
              top: defaultTop,
            });
          }

          group.setCoords();
          resolve(group);
        },
        { crossOrigin: "anonymous" }
      );
    });
  };

  const getTemplateLayout = (canvasWidth, canvasHeight) => {
    const nameFontSize = canvasWidth * 0.07;
    const dateFontSize = canvasWidth * 0.035;
    const nameTop = canvasHeight * 0.08;
    const dateTop = nameTop + nameFontSize + canvasHeight * 0.02;
    const qrSize = canvasWidth * 0.35;
    const qrTop = canvasHeight * 0.55;
    const brandingTop = qrTop + qrSize + canvasHeight * 0.025;
    return {
      nameFontSize,
      dateFontSize,
      nameTop,
      dateTop,
      qrSize,
      qrTop,
      brandingTop,
    };
  };

  const buildCleanLightTemplate = (canvasWidth, canvasHeight, eventName, eventDate) => {
    const { nameFontSize, dateFontSize, nameTop, dateTop, qrSize, qrTop } =
      getTemplateLayout(canvasWidth, canvasHeight);
    const lineY = nameTop + nameFontSize + canvasHeight * 0.01;
    const qrPad = qrSize * 0.1;
    return [
      new fabric.Rect({
        left: canvasWidth / 2 - qrSize / 2 - qrPad,
        top: qrTop - qrPad,
        width: qrSize + qrPad * 2,
        height: qrSize + qrPad * 2,
        fill: "#F9FAFB",
        rx: 18,
        ry: 18,
      }),
      new fabric.Line(
        [canvasWidth * 0.2, lineY, canvasWidth * 0.8, lineY],
        { stroke: "#FF2D8B", strokeWidth: 2 }
      ),
      new fabric.Textbox(eventName || "Event Name", {
        left: canvasWidth * 0.1,
        top: nameTop,
        width: canvasWidth * 0.8,
        fontSize: nameFontSize,
        fill: "#111111",
        fontWeight: "700",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventName" },
      }),
      new fabric.Textbox(eventDate || "Event Date", {
        left: canvasWidth * 0.1,
        top: dateTop,
        width: canvasWidth * 0.8,
        fontSize: dateFontSize,
        fill: "#6B7280",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventDate" },
      }),
    ];
  };

  const buildDarkMinimalTemplate = (canvasWidth, canvasHeight, eventName, eventDate) => {
    const { nameFontSize, dateFontSize, nameTop, dateTop } =
      getTemplateLayout(canvasWidth, canvasHeight);
    const lineY = nameTop + nameFontSize + canvasHeight * 0.01;
    const dots = [];
    for (let i = 0; i < 60; i += 1) {
      dots.push(
        new fabric.Rect({
          left: (canvasWidth / 10) * (i % 10),
          top: (canvasHeight / 6) * Math.floor(i / 10),
          width: 6,
          height: 6,
          fill: "rgba(255,255,255,0.06)",
        })
      );
    }
    return [
      ...dots,
      new fabric.Line(
        [canvasWidth * 0.2, lineY, canvasWidth * 0.8, lineY],
        { stroke: "#00D4FF", strokeWidth: 2 }
      ),
      new fabric.Textbox(eventName || "Event Name", {
        left: canvasWidth * 0.1,
        top: nameTop,
        width: canvasWidth * 0.8,
        fontSize: nameFontSize,
        fill: "#FFFFFF",
        fontWeight: "700",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventName" },
      }),
      new fabric.Textbox(eventDate || "Event Date", {
        left: canvasWidth * 0.1,
        top: dateTop,
        width: canvasWidth * 0.8,
        fontSize: dateFontSize,
        fill: "#9CA3AF",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventDate" },
      }),
    ];
  };

  const buildGradientGlowTemplate = (canvasWidth, canvasHeight, eventName, eventDate) => {
    const { nameFontSize, dateFontSize, nameTop, dateTop } =
      getTemplateLayout(canvasWidth, canvasHeight);
    return [
      new fabric.Circle({
        left: canvasWidth * 0.6,
        top: canvasHeight * 0.02,
        radius: canvasWidth * 0.35,
        fill: "rgba(255, 45, 139, 0.12)",
      }),
      new fabric.Circle({
        left: canvasWidth * 0.02,
        top: canvasHeight * 0.6,
        radius: canvasWidth * 0.32,
        fill: "rgba(0, 212, 255, 0.12)",
      }),
      new fabric.Textbox(eventName || "Event Name", {
        left: canvasWidth * 0.1,
        top: nameTop,
        width: canvasWidth * 0.8,
        fontSize: nameFontSize,
        fill: "#FFFFFF",
        fontWeight: "700",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventName" },
      }),
      new fabric.Textbox(eventDate || "Event Date", {
        left: canvasWidth * 0.1,
        top: dateTop,
        width: canvasWidth * 0.8,
        fontSize: dateFontSize,
        fill: "#00D4FF",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventDate" },
      }),
    ];
  };

  const buildSoftPastelTemplate = (canvasWidth, canvasHeight, eventName, eventDate) => {
    const { nameFontSize, dateFontSize, nameTop, dateTop, qrSize, qrTop } =
      getTemplateLayout(canvasWidth, canvasHeight);
    const qrPad = qrSize * 0.1;
    return [
      new fabric.Rect({
        left: canvasWidth * 0.12,
        top: canvasHeight * 0.08,
        width: canvasWidth * 0.76,
        height: canvasHeight * 0.18,
        fill: "rgba(255, 179, 204, 0.25)",
        rx: 30,
        ry: 30,
      }),
      new fabric.Rect({
        left: canvasWidth / 2 - qrSize / 2 - qrPad,
        top: qrTop - qrPad,
        width: qrSize + qrPad * 2,
        height: qrSize + qrPad * 2,
        fill: "#FFB3CC",
        rx: 22,
        ry: 22,
      }),
      new fabric.Textbox(eventName || "Event Name", {
        left: canvasWidth * 0.1,
        top: nameTop,
        width: canvasWidth * 0.8,
        fontSize: nameFontSize,
        fill: "#1F2937",
        fontWeight: "700",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventName" },
      }),
      new fabric.Textbox(eventDate || "Event Date", {
        left: canvasWidth * 0.1,
        top: dateTop,
        width: canvasWidth * 0.8,
        fontSize: dateFontSize,
        fill: "#DB2777",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventDate" },
      }),
    ];
  };

  const buildBoldSplitTemplate = (canvasWidth, canvasHeight, eventName, eventDate) => {
    const { nameFontSize, dateFontSize, nameTop, dateTop } =
      getTemplateLayout(canvasWidth, canvasHeight);
    return [
      new fabric.Rect({
        left: 0,
        top: 0,
        width: canvasWidth * 0.35,
        height: canvasHeight,
        fill: "#FF2D8B",
      }),
      new fabric.Circle({
        left: canvasWidth * 0.12,
        top: canvasHeight * 0.45,
        radius: 26,
        fill: "#FFFFFF",
      }),
      new fabric.Textbox(eventName || "Event Name", {
        left: canvasWidth * 0.1,
        top: nameTop,
        width: canvasWidth * 0.8,
        fontSize: nameFontSize,
        fill: "#FFFFFF",
        fontWeight: "700",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventName" },
      }),
      new fabric.Textbox(eventDate || "Event Date", {
        left: canvasWidth * 0.1,
        top: dateTop,
        width: canvasWidth * 0.8,
        fontSize: dateFontSize,
        fill: "#D1D5DB",
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        data: { type: "eventDate" },
      }),
    ];
  };

  const pruneDuplicatesByType = (type, preferredRef) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return null;
    const matches = fabricCanvas.getObjects().filter((obj) => obj?.data?.type === type);
    if (!matches.length) return null;
    const keep = preferredRef?.current || matches[0];
    matches.forEach((obj) => {
      if (obj !== keep) fabricCanvas.remove(obj);
    });
    if (preferredRef && keep) preferredRef.current = keep;
    return keep;
  };

  const getLayerLabel = (obj) => {
    const type = obj?.data?.type || obj?.type || "object";
    if (type === "eventName" || type === "eventDate") {
      return type === "eventName" ? "Event Name" : "Event Date";
    }
    if (type === "qr") return "QR Code";
    if (type === "textbox" || type === "text" || type === "i-text") {
      const text = obj.text || "Text";
      return `Text: ${String(text).slice(0, 14)}`;
    }
    if (type === "image") return "Image";
    if (type === "rect") return "Rectangle";
    if (type === "circle") return "Circle";
    if (type === "ellipse") return "Ellipse";
    if (type === "triangle") return "Triangle";
    if (type === "line") return "Line";
    if (type === "polygon") return "Shape";
    return "Element";
  };

  const getLayerIcon = (obj) => {
    const type = obj?.data?.type || obj?.type || "object";
    if (type === "eventName" || type === "eventDate") return "T";
    if (type === "textbox" || type === "text" || type === "i-text") return "T";
    if (type === "image") return "IMG";
    if (type === "qr") return "QR";
    if (type === "line") return "—";
    return "▢";
  };

  const syncLayers = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    objects.forEach((obj) => ensureLayerMeta(obj));
    const ordered = [...objects].reverse();
    setLayers(ordered);
    const active = fabricCanvas.getActiveObject();
    if (active?.data?.id) {
      setSelectedLayerId(active.data.id);
    } else if (!active) {
      setSelectedLayerId(null);
    }
  };

  const updateObject = (updates) => {
    const fabricCanvas = fabricCanvasRef.current;
    const active = fabricCanvas?.getActiveObject();
    if (!active) return;
    active.set(updates);
    active.setCoords();
    fabricCanvas.requestRenderAll();
    setSelectedObject(active);
    syncLayers();
  };

  const getCanvasSize = () => {
    const fabricCanvas = fabricCanvasRef.current;
    return {
      width: fabricCanvas?.getWidth?.() || baseSize.width,
      height: fabricCanvas?.getHeight?.() || baseSize.height,
    };
  };

  const toHex = (color, fallback = "#ffffff") => {
    if (!color) return fallback;
    if (typeof color === "string" && color.startsWith("#")) return color;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = color;
    return ctx.fillStyle;
  };

  const hexToRgba = (hex, alpha = 1) => {
    if (!hex) return `rgba(255,255,255,${alpha})`;
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const applyFill = (obj, colorHex, opacityValue) => {
    const opacity = opacityValue ?? (obj.data?.fillOpacity ?? 1);
    const rgba = hexToRgba(colorHex, opacity);
    obj.set("fill", rgba);
    obj.set("data", { ...obj.data, fillColor: colorHex, fillOpacity: opacity });
  };

  const applyStroke = (obj, colorHex, opacityValue) => {
    const opacity = opacityValue ?? (obj.data?.strokeOpacity ?? 1);
    const rgba = hexToRgba(colorHex, opacity);
    obj.set("stroke", rgba);
    obj.set("data", { ...obj.data, strokeColor: colorHex, strokeOpacity: opacity });
  };

  const clampNumber = (value, min, max) => Math.min(Math.max(value, min), max);

  const onNumberWheel = (event, current, step, onChange) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? step : -step;
    onChange(current + delta);
  };

  const alignObject = (type) => {
    const fabricCanvas = fabricCanvasRef.current;
    const obj = fabricCanvas?.getActiveObject();
    if (!fabricCanvas || !obj) return;
    const canvasSize = getCanvasSize();
    const width = obj.getScaledWidth();
    const height = obj.getScaledHeight();
    const next = { left: obj.left, top: obj.top };
    if (type === "left") next.left = 0;
    if (type === "center") next.left = (canvasSize.width - width) / 2;
    if (type === "right") next.left = canvasSize.width - width;
    if (type === "top") next.top = 0;
    if (type === "middle") next.top = (canvasSize.height - height) / 2;
    if (type === "bottom") next.top = canvasSize.height - height;
    updateObject(next);
  };

  const getScaledSize = (obj) => {
    if (!obj) return { w: 0, h: 0 };
    return {
      w: Math.round(obj.getScaledWidth?.() || 0),
      h: Math.round(obj.getScaledHeight?.() || 0),
    };
  };

  const setSize = (obj, width, height) => {
    if (!obj) return;
    const lock = obj.data?.lockAspect;
    const baseW = obj.width || 1;
    const baseH = obj.height || 1;
    if (lock) {
      const ratio = baseW / baseH;
      if (width !== null && width !== undefined) {
        obj.set({
          scaleX: width / baseW,
          scaleY: width / baseW,
        });
      } else if (height !== null && height !== undefined) {
        obj.set({
          scaleX: height / baseH,
          scaleY: height / baseH,
        });
      }
    } else {
      if (width !== null && width !== undefined) obj.set({ scaleX: width / baseW });
      if (height !== null && height !== undefined) obj.set({ scaleY: height / baseH });
    }
    obj.setCoords();
    fabricCanvasRef.current?.requestRenderAll();
    setSelectedObject(obj);
  };

  const toggleFillVisibility = (obj) => {
    if (!obj) return;
    const isHidden = obj.data?.fillHidden;
    const nextHidden = !isHidden;
    obj.set("data", { ...obj.data, fillHidden: nextHidden });
    if (nextHidden) {
      obj.set("fill", "rgba(0,0,0,0)");
    } else if (obj.data?.fillColor) {
      obj.set("fill", obj.data.fillColor);
    }
    obj.setCoords();
    fabricCanvasRef.current?.requestRenderAll();
    syncLayers();
  };

  const toggleStrokeVisibility = (obj) => {
    if (!obj) return;
    const isHidden = obj.data?.strokeHidden;
    const nextHidden = !isHidden;
    obj.set("data", { ...obj.data, strokeHidden: nextHidden });
    if (nextHidden) {
      obj.set("stroke", "rgba(0,0,0,0)");
    } else if (obj.data?.strokeColor) {
      obj.set("stroke", obj.data.strokeColor);
    }
    obj.setCoords();
    fabricCanvasRef.current?.requestRenderAll();
    syncLayers();
  };

  const setShadow = (obj, shadowData) => {
    if (!obj) return;
    if (!shadowData?.enabled) {
      obj.set("shadow", null);
      obj.set("data", { ...obj.data, shadow: shadowData });
      fabricCanvasRef.current?.requestRenderAll();
      return;
    }
    const shadow = new fabric.Shadow({
      color: shadowData.color || "rgba(0,0,0,0.35)",
      blur: shadowData.blur || 10,
      offsetX: shadowData.offsetX || 0,
      offsetY: shadowData.offsetY || 6,
    });
    obj.set("shadow", shadow);
    obj.set("data", { ...obj.data, shadow: shadowData });
    fabricCanvasRef.current?.requestRenderAll();
  };

  const getSelectedType = () => {
    if (!selectedObject) return "none";
    const type = selectedObject.data?.type || selectedObject.type;
    if (type === "qr") return "qr";
    if (type === "eventName" || type === "eventDate") return "text";
    if (type === "textbox" || type === "text" || type === "i-text") return "text";
    if (type === "image") return "image";
    if (
      type === "rect" ||
      type === "circle" ||
      type === "ellipse" ||
      type === "triangle" ||
      type === "polygon" ||
      type === "line"
    ) {
      return "shape";
    }
    return "other";
  };

  const setLayerLocked = (obj, locked) => {
    if (!obj) return;
    obj.set({
      selectable: !locked,
      evented: !locked,
      lockMovementX: locked,
      lockMovementY: locked,
      lockScalingX: locked,
      lockScalingY: locked,
      lockRotation: locked,
    });
    obj.set("data", { ...obj.data, locked });
  };

  const setLayerHidden = (obj, hidden) => {
    if (!obj) return;
    obj.set("visible", !hidden);
    obj.set("data", { ...obj.data, hidden });
  };

  useEffect(() => {
    const canvasEl = canvasElementRef.current;
    if (!canvasEl) return undefined;
    if (fabricCanvasRef.current) return undefined;

    fabric.Object.prototype.cornerColor = "#00D4FF";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderColor = "#00D4FF";
    fabric.Object.prototype.padding = 4;

    const fabricCanvas = new fabric.Canvas(canvasEl, {
      backgroundColor: "#0f111a",
      preserveObjectStacking: true,
      selection: true,
    });

    fabricCanvas.selectionColor = "rgba(0, 212, 255, 0.15)";
    fabricCanvas.selectionBorderColor = "#00D4FF";
    fabricCanvas.selectionLineWidth = 1.5;

    fabricCanvasRef.current = fabricCanvas;

  const handleSelection = () => {
    syncLayers();
    const fabricCanvas = fabricCanvasRef.current;
    const active = fabricCanvas?.getActiveObject() || null;
    if (active) {
      active.set("data", {
        ...active.data,
        fillColor: active.data?.fillColor || toHex(active.fill, "#ffffff"),
        strokeColor: active.data?.strokeColor || toHex(active.stroke, "#ffffff"),
        fillOpacity: active.data?.fillOpacity ?? (active.opacity ?? 1),
        strokeOpacity: active.data?.strokeOpacity ?? 1,
      });
    }
    setSelectedObject(active);
  };
    const handleObjectUpdate = (event) => {
      if (event?.target && event.target === qrGroupRef.current) {
        qrHasBeenMovedRef.current = true;
        qrTransformRef.current = {
          left: event.target.left,
          top: event.target.top,
          scaleX: event.target.scaleX || 1,
          scaleY: event.target.scaleY || 1,
          angle: event.target.angle || 0,
        };
      }
      syncLayers();
      scheduleHistory();
    };

    fabricCanvas.on("selection:created", handleSelection);
    fabricCanvas.on("selection:updated", handleSelection);
    fabricCanvas.on("selection:cleared", handleSelection);
    fabricCanvas.on("object:added", handleObjectUpdate);
    fabricCanvas.on("object:removed", handleObjectUpdate);
    fabricCanvas.on("object:modified", handleObjectUpdate);

    const starterRect = new fabric.Rect({
      left: 140,
      top: 140,
      width: 240,
      height: 150,
      fill: "#1c2032",
      stroke: "#00D4FF",
      strokeWidth: 2,
      rx: 14,
      ry: 14,
    });

    const starterText = new fabric.Textbox("Drag me around", {
      left: 170,
      top: 185,
      width: 200,
      fontSize: 22,
      fill: "#ffffff",
      fontFamily: "Tilt Neon, sans-serif",
    });

    fabricCanvas.add(starterRect, starterText);
    fabricCanvas.setActiveObject(starterRect);
    syncLayers();

    updateCanvasScale();
    pushHistory();

    if (canvasScrollRef.current) {
      const observer = new ResizeObserver(() => updateCanvasScale());
      observer.observe(canvasScrollRef.current);
      resizeObserverRef.current = observer;
    }

    return () => {
      fabricCanvas.off("selection:created", handleSelection);
      fabricCanvas.off("selection:updated", handleSelection);
      fabricCanvas.off("selection:cleared", handleSelection);
      fabricCanvas.off("object:added", handleObjectUpdate);
      fabricCanvas.off("object:removed", handleObjectUpdate);
      fabricCanvas.off("object:modified", handleObjectUpdate);
      resizeObserverRef.current?.disconnect();
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await get_event?.();
      const fetchedEvents = res?.data?.data || [];
      setEvents(fetchedEvents);
      if (fetchedEvents.length && !selectedEventId) {
        setSelectedEventId(fetchedEvents[0]._id);
      }
    };
    fetchEvents();
  }, [get_event, selectedEventId]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    const previousSize = previousSizeRef.current;
    const scaleX = baseSize.width / previousSize.width;
    const scaleY = baseSize.height / previousSize.height;
    const textScale = (scaleX + scaleY) / 2;

    fabricCanvas.getObjects().forEach((obj) => {
      const isText =
        obj.type === "textbox" || obj.type === "text" || obj.type === "i-text";

      const left = (obj.left || 0) * scaleX;
      const top = (obj.top || 0) * scaleY;

      if (isText) {
        const currentFontSize = obj.fontSize || 20;
        const normalizedFontSize =
          currentFontSize * ((obj.scaleX || 1) + (obj.scaleY || 1)) / 2;
        obj.set({
          left,
          top,
          width: (obj.width || 0) * scaleX,
          fontSize: normalizedFontSize * textScale,
          scaleX: 1,
          scaleY: 1,
        });
      } else {
        obj.set({
          left,
          top,
          scaleX: (obj.scaleX || 1) * scaleX,
          scaleY: (obj.scaleY || 1) * scaleY,
        });
      }

      obj.setCoords();
    });

    fabricCanvas.setWidth(baseSize.width);
    fabricCanvas.setHeight(baseSize.height);
    previousSizeRef.current = baseSize;
    updateCanvasScale();
  }, [baseSize.width, baseSize.height]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => updateCanvasScale());
    return () => cancelAnimationFrame(rafId);
  }, [isLeftCollapsed, isRightCollapsed]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      updateCanvasScale();
    }, 350);
    return () => window.clearTimeout(timeoutId);
  }, [isLeftCollapsed, isRightCollapsed]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => updateCanvasScale());
    return () => cancelAnimationFrame(rafId);
  }, [userZoom]);

  const formatEventDate = (value) => {
    if (!value) return "Date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDesignLabel = (card) => {
    if (!card) return "Untitled";
    if (card.name && String(card.name).trim()) return card.name;
    const date = new Date(card.updatedAt || card.createdAt || Date.now());
    if (Number.isNaN(date.getTime())) return "Untitled";
    return date.toLocaleString();
  };

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    let timeoutId;
    const addQrGroup = () => {
      const qrCanvas = qrCanvasRef.current?.querySelector("canvas");
      if (!qrCanvas) {
        timeoutId = window.setTimeout(addQrGroup, 40);
        return;
      }
      // Remove any existing QR groups to prevent duplicates.
      fabricCanvas.getObjects().forEach((obj) => {
        if (obj?.data?.type === "qr") {
          fabricCanvas.remove(obj);
        }
      });
      qrGroupRef.current = null;
      const dataUrl = qrCanvas.toDataURL("image/png");
      fabric.Image.fromURL(
        dataUrl,
        (img) => {
          const framePadding = 10;
          const frame = new fabric.Rect({
            width: img.width + framePadding * 2,
            height: img.height + framePadding * 2,
            fill: "#0f111a",
            stroke: "#00D4FF",
            strokeWidth: 2,
            rx: 12,
            ry: 12,
          });

          img.set({
            left: framePadding,
            top: framePadding,
          });

          const group = new fabric.Group([frame, img], {
            left: 0,
            top: 0,
            cornerStyle: "circle",
            cornerColor: "#00D4FF",
            transparentCorners: false,
          });
          group.set("data", { ...group.data, type: "qr" });
          ensureLayerMeta(group);
          const centeredLeft = (baseSize.width - group.getScaledWidth()) / 2;
          const centeredTop = (baseSize.height - group.getScaledHeight()) / 2;
          group.set({
            left: Math.max(0, centeredLeft),
            top: Math.max(0, centeredTop),
          });
          group.setCoords();

          qrGroupRef.current = group;
          group.set({
            selectable: true,
            evented: true,
            lockMovementX: false,
            lockMovementY: false,
            lockScalingX: false,
            lockScalingY: false,
            lockRotation: false,
            hasControls: true,
            hasBorders: true,
          });
          fabricCanvas.add(group);
          fabricCanvas.setActiveObject(group);
          fabricCanvas.requestRenderAll();
        },
        { crossOrigin: "anonymous" }
      );
    };

    timeoutId = window.setTimeout(addQrGroup, 40);
    return () => window.clearTimeout(timeoutId);
  }, [qrValue, qrVersion, baseSize.width, baseSize.height]);

  const rebindDesignRefs = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    eventNameRef.current = null;
    eventDateRef.current = null;
    qrGroupRef.current = null;
    fabricCanvas.getObjects().forEach((obj) => {
      ensureLayerMeta(obj);
      const type = obj.data?.type;
      const isLikelyQr =
        type === "qr" ||
        (obj.type === "group" &&
          Array.isArray(obj._objects) &&
          obj._objects.length === 2 &&
          obj._objects.some((child) => child.type === "image") &&
          obj._objects.some(
            (child) =>
              child.type === "rect" &&
              typeof child.stroke === "string" &&
              child.stroke.toLowerCase() === "#00d4ff"
          ));

      if (type === "eventName") eventNameRef.current = obj;
      if (type === "eventDate") eventDateRef.current = obj;
      if (isLikelyQr) {
        obj.set("data", { ...obj.data, type: "qr" });
        obj.set({
          selectable: true,
          evented: true,
          lockMovementX: false,
          lockMovementY: false,
          lockScalingX: false,
          lockScalingY: false,
          lockRotation: false,
          hasControls: true,
          hasBorders: true,
        });
        qrGroupRef.current = obj;
      }
    });
    pruneDuplicatesByType("eventName", eventNameRef);
    pruneDuplicatesByType("eventDate", eventDateRef);
    pruneDuplicatesByType("qr", qrGroupRef);
    syncLayers();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas) return;
      const active = fabricCanvas.getActiveObject();
      if (!active) return;
      if (active === qrGroupRef.current) return;
      fabricCanvas.remove(active);
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const upsertText = (ref, textValue, config) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    if (ref.current) {
      ref.current.set({ text: textValue, ...config });
      ref.current.setCoords();
    } else {
      const textObj = new fabric.Textbox(textValue, config);
      ref.current = textObj;
      fabricCanvas.add(textObj);
    }
  };

  const syncEventDetails = (templateAccent, options = { updateText: true }) => {
    if (!selectedEventId) return;
    const selectedEvent = events.find((event) => event._id === selectedEventId);
    if (!selectedEvent) return;
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      pruneDuplicatesByType("eventName", eventNameRef);
      pruneDuplicatesByType("eventDate", eventDateRef);
    }
    const link = `${APP_URL}/event/${selectedEvent.user_id}/${selectedEvent._id}`;
    setQrValue(link);
    setQrVersion((prev) => prev + 1);
    if (!options.updateText) {
      return;
    }

    upsertText(eventNameRef, selectedEvent.EventName || "Event Name", {
      left: 90,
      top: 80,
      width: 360,
      fontSize: 38,
      fontFamily: "Tilt Neon, sans-serif",
      fill: templateAccent || "#ffffff",
      fontWeight: "700",
      data: { type: "eventName" },
    });

    upsertText(eventDateRef, formatEventDate(selectedEvent.EventDate), {
      left: 92,
      top: 140,
      width: 260,
      fontSize: 20,
      fontFamily: "Tilt Neon, sans-serif",
      fill: templateAccent || "#00D4FF",
      fontWeight: "600",
      data: { type: "eventDate" },
    });
  };

  useEffect(() => {
    if (isLoadingDesignRef.current) {
      syncEventDetails(undefined, { updateText: false });
      return;
    }
    syncEventDetails();
  }, [selectedEventId, events]);

  const handleZoomIn = () => {
    setUserZoom((prev) => clamp(Number((prev + 0.1).toFixed(2)), 0.2, 3));
  };

  const handleZoomOut = () => {
    setUserZoom((prev) => clamp(Number((prev - 0.1).toFixed(2)), 0.2, 3));
  };

  const captureCanvasImage = async () => {
    const canvasNode = canvasElementRef.current;
    if (!canvasNode) return null;
    const capture = await html2canvas(canvasNode, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    return capture.toDataURL("image/png");
  };

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await captureCanvasImage();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "event-card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast?.("PNG exported successfully", "success");
    } catch (error) {
      showToast?.("Failed to export PNG", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await captureCanvasImage();
      if (!dataUrl) return;
      const orientation =
        baseSize.width >= baseSize.height ? "landscape" : "portrait";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [baseSize.width, baseSize.height],
      });
      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        baseSize.width,
        baseSize.height
      );
      pdf.save("event-card.pdf");
      showToast?.("PDF exported successfully", "success");
    } catch (error) {
      showToast?.("Failed to export PDF", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await captureCanvasImage();
      if (!dataUrl) return;
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Event Card</title>
            <style>
              html, body { margin: 0; padding: 0; }
              img { width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Event Card" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      showToast?.("Print dialog opened", "success");
    } catch (error) {
      showToast?.("Failed to print card", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const getShareLink = () => {
    if (!selectedDesignId || selectedDesignId === "new") {
      return "";
    }
    return `${APP_URL}/card/${selectedDesignId}`;
  };

  const handleCopyShareLink = async () => {
    const link = getShareLink();
    if (!link) {
      showToast?.("Save a design before sharing", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      showToast?.("Share link copied", "success");
    } catch (error) {
      showToast?.("Failed to copy link", "error");
    }
  };

  const handleShareWhatsapp = () => {
    const link = getShareLink();
    if (!link) {
      showToast?.("Save a design before sharing", "error");
      return;
    }
    const text = encodeURIComponent(`Check out my event card: ${link}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };


  const handleAddText = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    const text = new fabric.Textbox(textValue || "New Text", {
      left: 120,
      top: 90,
      width: 260,
      fontSize: 32,
      fontFamily: "Tilt Neon, sans-serif",
      fill: "#ffffff",
      fontWeight: "600",
      editable: true,
    });
    text.set("data", {
      ...text.data,
      type: "textbox",
      fillColor: toHex(text.fill, "#ffffff"),
      strokeColor: toHex(text.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(text);

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.requestRenderAll();
  };

  const handleAddRectangle = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const rect = new fabric.Rect({
      left: 140,
      top: 200,
      width: 220,
      height: 140,
      fill: "#1c2032",
      stroke: "#ff2d8b",
      strokeWidth: 2,
      rx: 16,
      ry: 16,
    });
    rect.set("data", {
      ...rect.data,
      type: "rect",
      fillColor: toHex(rect.fill, "#ffffff"),
      strokeColor: toHex(rect.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(rect);
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.requestRenderAll();
  };

  const handleAddRoundedRectangle = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const rect = new fabric.Rect({
      left: 150,
      top: 210,
      width: 240,
      height: 120,
      fill: "#20263a",
      stroke: "#00D4FF",
      strokeWidth: 2,
      rx: 28,
      ry: 28,
    });
    rect.set("data", {
      ...rect.data,
      type: "rect",
      fillColor: toHex(rect.fill, "#ffffff"),
      strokeColor: toHex(rect.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(rect);
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.requestRenderAll();
  };

  const handleAddCircle = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const circle = new fabric.Circle({
      left: 180,
      top: 220,
      radius: 70,
      fill: "rgba(255, 45, 139, 0.2)",
      stroke: "#00D4FF",
      strokeWidth: 2,
    });
    circle.set("data", {
      ...circle.data,
      type: "circle",
      fillColor: toHex(circle.fill, "#ffffff"),
      strokeColor: toHex(circle.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(circle);
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.requestRenderAll();
  };

  const handleAddEllipse = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const ellipse = new fabric.Ellipse({
      left: 170,
      top: 230,
      rx: 90,
      ry: 55,
      fill: "rgba(0, 212, 255, 0.18)",
      stroke: "#ff2d8b",
      strokeWidth: 2,
    });
    ellipse.set("data", {
      ...ellipse.data,
      type: "ellipse",
      fillColor: toHex(ellipse.fill, "#ffffff"),
      strokeColor: toHex(ellipse.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(ellipse);
    fabricCanvas.add(ellipse);
    fabricCanvas.setActiveObject(ellipse);
    fabricCanvas.requestRenderAll();
  };

  const handleAddLine = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const line = new fabric.Line([50, 50, 240, 50], {
      left: 120,
      top: 320,
      stroke: "#ffffff",
      strokeWidth: 3,
    });
    line.set("data", {
      ...line.data,
      type: "line",
      strokeColor: toHex(line.stroke, "#ffffff"),
      strokeOpacity: 1,
    });
    ensureLayerMeta(line);
    fabricCanvas.add(line);
    fabricCanvas.setActiveObject(line);
    fabricCanvas.requestRenderAll();
  };

  const handleAddTriangle = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const triangle = new fabric.Triangle({
      left: 180,
      top: 220,
      width: 140,
      height: 120,
      fill: "rgba(255, 45, 139, 0.2)",
      stroke: "#00D4FF",
      strokeWidth: 2,
    });
    triangle.set("data", {
      ...triangle.data,
      type: "triangle",
      fillColor: toHex(triangle.fill, "#ffffff"),
      strokeColor: toHex(triangle.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(triangle);
    fabricCanvas.add(triangle);
    fabricCanvas.setActiveObject(triangle);
    fabricCanvas.requestRenderAll();
  };

  const handleAddStar = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const points = [
      { x: 0, y: -60 },
      { x: 18, y: -18 },
      { x: 60, y: -18 },
      { x: 28, y: 6 },
      { x: 40, y: 52 },
      { x: 0, y: 25 },
      { x: -40, y: 52 },
      { x: -28, y: 6 },
      { x: -60, y: -18 },
      { x: -18, y: -18 },
    ];
    const star = new fabric.Polygon(points, {
      left: 200,
      top: 240,
      fill: "rgba(255, 255, 255, 0.2)",
      stroke: "#ff2d8b",
      strokeWidth: 2,
    });
    star.set("data", {
      ...star.data,
      type: "polygon",
      fillColor: toHex(star.fill, "#ffffff"),
      strokeColor: toHex(star.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(star);
    fabricCanvas.add(star);
    fabricCanvas.setActiveObject(star);
    fabricCanvas.requestRenderAll();
  };

  const handleAddHexagon = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const points = [
      { x: 40, y: 0 },
      { x: 80, y: 22 },
      { x: 80, y: 68 },
      { x: 40, y: 90 },
      { x: 0, y: 68 },
      { x: 0, y: 22 },
    ];
    const hex = new fabric.Polygon(points, {
      left: 200,
      top: 240,
      fill: "rgba(0, 212, 255, 0.2)",
      stroke: "#ffffff",
      strokeWidth: 2,
    });
    hex.set("data", {
      ...hex.data,
      type: "polygon",
      fillColor: toHex(hex.fill, "#ffffff"),
      strokeColor: toHex(hex.stroke, "#ffffff"),
      fillOpacity: 1,
      strokeOpacity: 1,
    });
    ensureLayerMeta(hex);
    fabricCanvas.add(hex);
    fabricCanvas.setActiveObject(hex);
    fabricCanvas.requestRenderAll();
  };

  const applyTemplate = async (template) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const selectedEvent = events.find((event) => event._id === selectedEventId);
    const eventName = selectedEvent?.EventName || "Event Name";
    const eventDate = formatEventDate(selectedEvent?.EventDate);

    const backgroundByTemplate = {
      "clean-light": "#FFFFFF",
      "dark-minimal": "#0A0A0A",
      "gradient-glow": "#0B0F1A",
      "soft-pastel": "#FFF5F8",
      "bold-split": "#111111",
    };

    fabricCanvas.clear();
    fabricCanvas.setBackgroundColor(
      backgroundByTemplate[template.id] || "#FFFFFF",
      fabricCanvas.renderAll.bind(fabricCanvas)
    );
    setFrameColor(backgroundByTemplate[template.id] || "#FFFFFF");

    eventNameRef.current = null;
    eventDateRef.current = null;

    const builders = {
      "clean-light": buildCleanLightTemplate,
      "dark-minimal": buildDarkMinimalTemplate,
      "gradient-glow": buildGradientGlowTemplate,
      "soft-pastel": buildSoftPastelTemplate,
      "bold-split": buildBoldSplitTemplate,
    };

    const build = builders[template.id] || buildCleanLightTemplate;
    const objects = build(baseSize.width, baseSize.height, eventName, eventDate);

    objects.forEach((obj) => {
      ensureLayerMeta(obj);
      if (obj.data?.type === "eventName") eventNameRef.current = obj;
      if (obj.data?.type === "eventDate") eventDateRef.current = obj;
      fabricCanvas.add(obj);
    });

    const qrCanvas = qrCanvasRef.current?.querySelector("canvas");
    const qrDataUrl = qrCanvas ? qrCanvas.toDataURL("image/png") : null;
    const qrGroup = await buildQrGroup(
      fabricCanvas,
      qrDataUrl,
      baseSize.width,
      baseSize.height
    );
    if (qrGroup) {
      qrGroupRef.current = qrGroup;
      fabricCanvas.add(qrGroup);
      const brandingColor =
        template.id === "dark-minimal"
          ? "#E5E7EB"
          : template.id === "bold-split"
          ? "#FFFFFF"
          : template.id === "gradient-glow"
          ? "#FF2D8B"
          : "#FF2D8B";
      const { brandingTop } = getTemplateLayout(baseSize.width, baseSize.height);
      const branding = new fabric.Textbox("Created with Memois", {
        left: baseSize.width * 0.1,
        top: brandingTop,
        width: baseSize.width * 0.8,
        fontSize: baseSize.width * 0.025,
        fill: brandingColor,
        fontFamily: "Tilt Neon, sans-serif",
        textAlign: "center",
        opacity: 0.7,
      });
      branding.set("data", { ...branding.data, type: "branding" });
      ensureLayerMeta(branding);
      fabricCanvas.add(branding);
    }

    syncLayers();
    fabricCanvas.requestRenderAll();
    pushHistory();
  };

  const serializeCanvas = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return null;
    return fabricCanvas.toJSON(["data"]);
  };

  const captureHistoryState = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return null;
    return {
      elements: serializeCanvas(),
      background: fabricCanvas.backgroundColor || null,
      backgroundImage: fabricCanvas.backgroundImage?.src || null,
    };
  };

  const pushHistory = () => {
    if (historyRef.current.isApplying) return;
    const state = captureHistoryState();
    if (!state) return;
    const serialized = JSON.stringify(state);
    if (historyRef.current.last === serialized) return;
    historyRef.current.undo.push(serialized);
    if (historyRef.current.undo.length > 50) {
      historyRef.current.undo.shift();
    }
    historyRef.current.redo = [];
    historyRef.current.last = serialized;
  };

  const scheduleHistory = () => {
    if (historyTimeoutRef.current) {
      window.clearTimeout(historyTimeoutRef.current);
    }
    historyTimeoutRef.current = window.setTimeout(() => {
      pushHistory();
    }, 250);
  };

  const applyHistoryState = (serialized) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas || !serialized) return;
    const parsed = JSON.parse(serialized);
    historyRef.current.isApplying = true;
    fabricCanvas.clear();
    if (parsed.background) {
      fabricCanvas.setBackgroundColor(
        parsed.background,
        fabricCanvas.renderAll.bind(fabricCanvas)
      );
    }
    if (parsed.backgroundImage) {
      setCanvasBackgroundImage(parsed.backgroundImage);
    }
    fabricCanvas.loadFromJSON(parsed.elements || {}, () => {
      rebindDesignRefs();
      syncEventDetails(undefined, { updateText: false });
      fabricCanvas.requestRenderAll();
      historyRef.current.last = serialized;
      historyRef.current.isApplying = false;
    });
  };

  const handleUndo = () => {
    if (historyRef.current.undo.length < 2) return;
    const current = historyRef.current.undo.pop();
    historyRef.current.redo.push(current);
    const previous = historyRef.current.undo[historyRef.current.undo.length - 1];
    applyHistoryState(previous);
  };

  const handleRedo = () => {
    if (!historyRef.current.redo.length) return;
    const next = historyRef.current.redo.pop();
    historyRef.current.undo.push(next);
    applyHistoryState(next);
  };

  const setCanvasBackgroundImage = (dataUrl) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas || !dataUrl) return;
    fabric.Image.fromURL(
      dataUrl,
      (img) => {
        const scaleX = baseSize.width / img.width;
        const scaleY = baseSize.height / img.height;
        img.set({
          originX: "left",
          originY: "top",
          scaleX,
          scaleY,
        });
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
        scheduleHistory();
      },
      { crossOrigin: "anonymous" }
    );
  };

  const setCanvasBackgroundColor = (color) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas || !color) return;
    fabricCanvas.setBackgroundColor(color, fabricCanvas.renderAll.bind(fabricCanvas));
  };

  const saveDesign = async (silent = false) => {
    if (!selectedEventId) return;
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    const payload = {
      eventId: selectedEventId,
      elements: serializeCanvas(),
      background: fabricCanvas.backgroundColor || null,
      backgroundImage: fabricCanvas.backgroundImage?.src || null,
      canvasSize: { width: baseSize.width, height: baseSize.height },
      templateId: activeTemplate,
      name: designName || "Untitled",
    };

    setIsSaving(true);
    try {
      if (selectedDesignId && selectedDesignId !== "new") {
        const res = await axios.put(`/api/cards/${selectedDesignId}`, payload);
        const updated = res?.data?.data;
        if (updated) {
          setSavedDesigns((current) =>
            current.map((item) => (item._id === updated._id ? updated : item))
          );
        }
      } else {
        const res = await axios.post("/api/cards/save", payload);
        const created = res?.data?.data;
        if (created?._id) {
          setSelectedDesignId(created._id);
          setSavedDesigns((current) => [created, ...current]);
        }
      }
      if (!silent) {
        showToast?.("Card saved", "success");
      }
    } catch (error) {
      if (!silent) {
        showToast?.("Failed to save card", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenameDesign = async (cardId, nextName) => {
    if (!cardId || cardId === "new") return;
    const name = String(nextName || "").trim() || "Untitled";
    setSavedDesigns((current) =>
      current.map((item) => (item._id === cardId ? { ...item, name } : item))
    );
    try {
      const res = await axios.put(`/api/cards/${cardId}`, { name });
      const updated = res?.data?.data;
      if (updated) {
        setSavedDesigns((current) =>
          current.map((item) => (item._id === updated._id ? updated : item))
        );
      }
    } catch (error) {
      showToast?.("Failed to rename draft", "error");
    }
  };

  const handleDeleteDesign = async (cardId) => {
    if (!cardId || cardId === "new") return;
    try {
      await axios.delete(`/api/cards/${cardId}`);
      setSavedDesigns((current) => current.filter((item) => item._id !== cardId));
      if (selectedDesignId === cardId) {
        setSelectedDesignId("new");
        setDesignName("Untitled");
      }
      showToast?.("Draft deleted", "success");
    } catch (error) {
      showToast?.("Failed to delete draft", "error");
    }
  };

  const handleLoadDesign = (cardId) => {
    if (!cardId || cardId === "new") {
      setSelectedDesignId("new");
      setDesignName("Untitled");
      const template = templates.find((item) => item.id === activeTemplate);
      if (template) {
        applyTemplate(template);
      }
      return;
    }

    const design = savedDesigns.find((card) => card._id === cardId);
    if (!design) return;
    setPendingDesign(design);
    setSelectedDesignId(design._id);
    setDesignName(design.name || "Untitled");
  };

  useEffect(() => {
    if (!pendingDesign) return;
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    isLoadingDesignRef.current = true;

    const mode = getCanvasModeFromSize(pendingDesign.canvasSize);
    previousSizeRef.current = pendingDesign.canvasSize || baseSize;
    setCanvasMode(mode);
    setActiveTemplate(pendingDesign.templateId || activeTemplate);

    fabricCanvas.clear();
    if (pendingDesign.background) {
      fabricCanvas.setBackgroundColor(
        pendingDesign.background,
        fabricCanvas.renderAll.bind(fabricCanvas)
      );
      setFrameColor(pendingDesign.background);
    }
    if (pendingDesign.backgroundImage) {
      setCanvasBackgroundImage(pendingDesign.backgroundImage);
    }

    fabricCanvas.loadFromJSON(pendingDesign.elements || {}, () => {
      rebindDesignRefs();
      syncEventDetails(undefined, { updateText: false });
      fabricCanvas.requestRenderAll();
      isLoadingDesignRef.current = false;
    });

    setDesignName(pendingDesign.name || "Untitled");
    setPendingDesign(null);
  }, [pendingDesign]);

  useEffect(() => {
    const loadDesigns = async () => {
      if (!selectedEventId) return;
      try {
        const res = await axios.get(`/api/cards/${selectedEventId}`);
        const cards = res?.data?.data || [];
        setSavedDesigns(cards);
        if (cards.length) {
          setSelectedDesignId(cards[0]._id);
          setPendingDesign(cards[0]);
        } else {
          setSelectedDesignId("new");
          setDesignName("Untitled");
        }
      } catch (error) {
        setSavedDesigns([]);
        setSelectedDesignId("new");
        setDesignName("Untitled");
      }
    };
    loadDesigns();
  }, [selectedEventId]);

  useEffect(() => {
    if (!selectedEventId) return undefined;
    const intervalId = window.setInterval(() => {
      saveDesign(true);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [selectedEventId, selectedDesignId, baseSize.width, baseSize.height, activeTemplate]);

  const handleDeleteSelected = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObject();
    if (!active) return;
    if (active === qrGroupRef.current) return;
    if (active.data?.locked || active.selectable === false) return;
    fabricCanvas.remove(active);
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    syncLayers();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload an image file.");
      return;
    }

    setImageError("");
    setImageFileName(file.name || "Selected image");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (!dataUrl || typeof dataUrl !== "string") return;
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas) return;

      fabric.Image.fromURL(
        dataUrl,
        (img) => {
          img.set({
            left: 120,
            top: 140,
            scaleX: 0.5,
            scaleY: 0.5,
            cornerStyle: "circle",
            cornerColor: "#00D4FF",
            transparentCorners: false,
          });
          img.set("data", { ...img.data, type: "image" });
          ensureLayerMeta(img);
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.requestRenderAll();
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast?.("Please upload an image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (!dataUrl || typeof dataUrl !== "string") return;
      setCanvasBackgroundImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="event-card-builder">
      <div className="builder-header">
        <div className="builder-title">
          <h1>Event Card Builder</h1>
          <p>Start shaping your invite. We’ll add more tools next.</p>
        </div>
        <div className="builder-actions">
          <div className="event-select">
            <label htmlFor="event-select">Event</label>
            <select
              id="event-select"
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
              disabled={!events.length}
            >
              {!events.length && <option value="">No events yet</option>}
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.EventName || "Untitled Event"}
                </option>
              ))}
            </select>
          </div>
          <div className="ratio-group">
            <label htmlFor="ratio-select">Canvas Size</label>
            <select
              id="ratio-select"
              value={canvasMode}
              onChange={(event) => setCanvasMode(event.target.value)}
            >
              <option value="1:1">1:1 — Square (500x500)</option>
              <option value="4:3">4:3 — Landscape (800x600)</option>
              <option value="3:4">3:4 — Portrait (600x800)</option>
              <option value="16:9">16:9 — Widescreen (800x450)</option>
              <option value="9:16">9:16 — Story (450x800)</option>
              <option value="A4">A4 — Print (595x842)</option>
            </select>
          
          </div>
          <button type="button" onClick={() => saveDesign(false)} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <div className="export-group">
            <button type="button" onClick={handleUndo}>
              Undo
            </button>
            <button type="button" onClick={handleRedo}>
              Redo
            </button>
            <button type="button" onClick={handleDownloadPng} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export PNG"}
            </button>
            <button type="button" onClick={handleDownloadPdf} disabled={isExporting}>
              Export PDF
            </button>
            <button type="button" onClick={handlePrint} disabled={isExporting}>
              Print
            </button>
          </div>
          <div className="share-group">
            <button type="button" onClick={handleCopyShareLink} disabled={isSharing}>
              Copy Link
            </button>
            <button type="button" onClick={handleShareWhatsapp} disabled={isSharing}>
              WhatsApp
            </button>
          </div>
          <label className="background-upload">
            Background Image
            <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
          </label>
        </div>
      </div>

      <div
        className={`builder-body ${isLeftCollapsed ? "left-collapsed" : ""} ${
          isRightCollapsed ? "right-collapsed" : ""
        }`}
      >
        <div className={`sidebar-shell left ${isLeftCollapsed ? "collapsed" : ""}`}>
          <button
            type="button"
            className="collapse-handle collapse-right"
            onClick={() => setIsLeftCollapsed((prev) => !prev)}
            aria-label={isLeftCollapsed ? "Expand left panel" : "Collapse left panel"}
          >
            {isLeftCollapsed ? "▶" : "◀"}
          </button>
          <aside className={`builder-panel left-panel ${isLeftCollapsed ? "collapsed" : ""}`}>
          <h3>Elements</h3>
          <div className="panel-group">
            <label>Saved Designs</label>
            <div className="design-dropdown">
              <div className="design-dropdown-trigger">
                {editingDesignId === selectedDesignId && selectedDesignId !== "new" ? (
                  <input
                    type="text"
                    autoFocus
                    className="design-trigger-input"
                    value={designName}
                    onChange={(event) => setDesignName(event.target.value)}
                    onBlur={(event) => {
                      handleRenameDesign(selectedDesignId, event.target.value);
                      setEditingDesignId(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur();
                      }
                      if (event.key === "Escape") {
                        setEditingDesignId(null);
                      }
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="design-trigger-label"
                    onClick={() => {
                      if (selectedDesignId !== "new") {
                        setEditingDesignId(selectedDesignId);
                      }
                    }}
                  >
                    {selectedDesignId === "new"
                      ? "New design"
                      : formatDesignLabel(
                          savedDesigns.find((card) => card._id === selectedDesignId)
                        )}
                  </button>
                )}
                <button
                  type="button"
                  className="design-caret"
                  onClick={() => setIsDesignDropdownOpen((prev) => !prev)}
                  aria-label="Toggle drafts"
                >
                  ▾
                </button>
              </div>
              {isDesignDropdownOpen && (
                <div className="design-dropdown-menu">
                  <button
                    type="button"
                    className={`design-option ${
                      selectedDesignId === "new" ? "active" : ""
                    }`}
                    onClick={() => {
                      handleLoadDesign("new");
                      setIsDesignDropdownOpen(false);
                    }}
                  >
                    <span className="design-option-label">New design</span>
                  </button>
                  {savedDesigns.map((card) => {
                    const isEditing = editingDesignId === card._id;
                    return (
                      <div
                        key={card._id}
                        className={`design-option ${
                          selectedDesignId === card._id ? "active" : ""
                        }`}
                        onClick={() => handleLoadDesign(card._id)}
                        onDoubleClick={() => setEditingDesignId(card._id)}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            autoFocus
                            className="design-option-input"
                            defaultValue={card.name || formatDesignLabel(card)}
                            onClick={(event) => event.stopPropagation()}
                            onBlur={(event) => {
                              handleRenameDesign(card._id, event.target.value);
                              setEditingDesignId(null);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.currentTarget.blur();
                              }
                              if (event.key === "Escape") {
                                setEditingDesignId(null);
                              }
                            }}
                          />
                        ) : (
                          <span className="design-option-label">
                            {formatDesignLabel(card)}
                          </span>
                        )}
                        <button
                          type="button"
                          className="design-option-delete"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteDesign(card._id);
                          }}
                          aria-label="Delete draft"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="panel-group">
            <label htmlFor="builder-text-input">Text</label>
            <input
              id="builder-text-input"
              type="text"
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              placeholder="Type your text"
            />
            <button
              type="button"
              className="panel-button"
              onClick={handleAddText}
            >
              Add Text
            </button>
          </div>
          <div className="panel-group">
            <label htmlFor="builder-image-input">Image</label>
            <label className="file-input">
              Choose Image
              <input
                id="builder-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <span className="file-name">{imageFileName}</span>
            {imageError && <p className="panel-error">{imageError}</p>}
          </div>
          <div className="panel-group">
            <label>Frame Color</label>
            <input
              type="color"
              value={frameColor}
              onChange={(event) => {
                const next = event.target.value;
                setFrameColor(next);
                setCanvasBackgroundColor(next);
              }}
            />
            <label>Frame Width</label>
            <input
              type="number"
              min="0"
              max="12"
              value={frameWidth}
              onChange={(event) => setFrameWidth(Number(event.target.value))}
            />
          </div>
          <div className="panel-group">
            <label>Templates</label>
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`panel-button ${activeTemplate === template.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTemplate(template.id);
                  applyTemplate(template);
                }}
              >
                {template.name}
              </button>
            ))}
          </div>
          <div className="panel-group">
            <label>Shapes</label>
            <div className="shape-grid">
              <button
                type="button"
                className="shape-card"
                onClick={handleAddRectangle}
                aria-label="Rectangle"
                data-label="Rectangle"
              >
                <span className="shape-preview rect"></span>
              </button>
              <button
                type="button"
                className="shape-card"
                onClick={handleAddRoundedRectangle}
                aria-label="Rounded Rectangle"
                data-label="Rounded"
              >
                <span className="shape-preview rounded"></span>
              </button>
              <button
                type="button"
                className="shape-card"
                onClick={handleAddCircle}
                aria-label="Circle"
                data-label="Circle"
              >
                <span className="shape-preview circle"></span>
              </button>
              <button
                type="button"
                className="shape-card"
                onClick={handleAddEllipse}
                aria-label="Ellipse"
                data-label="Ellipse"
              >
                <span className="shape-preview ellipse"></span>
              </button>
              <button
                type="button"
                className="shape-card"
                onClick={handleAddLine}
                aria-label="Line"
                data-label="Line"
              >
                <span className="shape-preview line"></span>
              </button>
              <button
                type="button"
                className="shape-card"
                onClick={handleAddTriangle}
                aria-label="Triangle"
                data-label="Triangle"
              >
                <span className="shape-preview triangle"></span>
              </button>
              <button
                type="button"
                className="shape-card"
                onClick={handleAddStar}
                aria-label="Star"
                data-label="Star"
              >
                <span className="shape-preview star"></span>
              </button>
              <button
                type="button"
                className="shape-card"
                onClick={handleAddHexagon}
                aria-label="Hexagon"
                data-label="Hexagon"
              >
                <span className="shape-preview hex"></span>
              </button>
            </div>
          </div>
          <div className="panel-note">
            QR code is added automatically and cannot be removed.
          </div>
          <div className="panel-note">
            Drag the sample block on the canvas to verify movement and resizing.
          </div>
          </aside>
        </div>

        <main
          className={`builder-canvas ${userZoom > 1.01 ? "is-zoomed" : ""}`}
          ref={canvasStageRef}
          style={{
            "--frame-color": frameColor,
            "--frame-width": `${frameWidth}px`,
          }}
        >
          <div className="canvas-zoom">
            <button type="button" onClick={handleZoomOut}>
              -
            </button>
            <span>{Math.round(userZoom * 100)}%</span>
            <button type="button" onClick={handleZoomIn}>
              +
            </button>
          </div>
          <div className="mobile-tools">
            <button type="button" onClick={handleAddText}>
              <i className="bx bx-text"></i>
              Text
            </button>
            <label className="mobile-upload">
              <i className="bx bx-image-add"></i>
              Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <button type="button" onClick={() => saveDesign(false)} disabled={isSaving}>
              <i className="bx bx-save"></i>
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={handleDownloadPng} disabled={isExporting}>
              <i className="bx bx-download"></i>
              {isExporting ? "Exporting..." : "PNG"}
            </button>
          </div>
          <div
            className="canvas-scroll"
            ref={canvasScrollRef}
            onWheel={(event) => {
              if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                const direction = event.deltaY > 0 ? -1 : 1;
                setUserZoom((prev) =>
                  clamp(Number((prev + direction * 0.05).toFixed(2)), 0.2, 3)
                );
              }
            }}
          >
            <div
              className="canvas-shell"
              ref={canvasContainerRef}
              style={{
                width: `${canvasDisplaySize.width}px`,
                height: `${canvasDisplaySize.height}px`,
              }}
            >
              <canvas ref={canvasElementRef} />
            </div>
          </div>
          {(isExporting || isSaving) && (
            <div className="canvas-overlay">
              {isExporting ? "Exporting card..." : "Saving draft..."}
            </div>
          )}
          <div className="zoom-hint">Ctrl + scroll to zoom</div>
        </main>

        <div className={`sidebar-shell right ${isRightCollapsed ? "collapsed" : ""}`}>
          <button
            type="button"
            className="collapse-handle collapse-left"
            onClick={() => setIsRightCollapsed((prev) => !prev)}
            aria-label={isRightCollapsed ? "Expand right panel" : "Collapse right panel"}
          >
            {isRightCollapsed ? "◀" : "▶"}
          </button>
          <aside className={`builder-panel right-panel ${isRightCollapsed ? "collapsed" : ""}`}>
            <div className="sidebar-topbar"></div>
            <div className="panel-section">
              <button
                type="button"
                className="section-toggle"
                onClick={() => setLayersCollapsed((prev) => !prev)}
                aria-label="Toggle layers"
              >
                <span>Layers</span>
                <span className={`toggle-icon ${layersCollapsed ? "collapsed" : ""}`}>
                  ▼
                </span>
              </button>
              {!layersCollapsed && (
                <div className="layers-list">
                  {layers.map((layer) => {
                    const label = getLayerLabel(layer);
                    const icon = getLayerIcon(layer);
                    const isSelected = selectedLayerId === layer.data?.id;
                    const isLocked = layer.data?.locked || layer.selectable === false;
                    const isHidden = layer.data?.hidden || layer.visible === false;
                    return (
                      <button
                        key={layer.data?.id}
                        type="button"
                        className={`layer-item ${isSelected ? "active" : ""} ${
                          isHidden ? "is-hidden" : ""
                        }`}
                        onClick={() => {
                          const fabricCanvas = fabricCanvasRef.current;
                          if (!fabricCanvas) return;
                          if (layer.data?.locked || layer.selectable === false) {
                            return;
                          }
                          fabricCanvas.setActiveObject(layer);
                          fabricCanvas.requestRenderAll();
                          setSelectedLayerId(layer.data?.id || null);
                        }}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          setLayerContextMenu({
                            x: event.clientX,
                            y: event.clientY,
                            layerId: layer.data?.id || null,
                          });
                        }}
                      >
                        <span className="layer-icon">{icon}</span>
                        <span className="layer-label">{label}</span>
                        <span className="layer-actions">
                          <button
                            type="button"
                            className={`layer-action ${isHidden ? "is-visible" : ""}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setLayerHidden(layer, !isHidden);
                              const fabricCanvas = fabricCanvasRef.current;
                              fabricCanvas?.requestRenderAll();
                              syncLayers();
                            }}
                            aria-label={isHidden ? "Show layer" : "Hide layer"}
                          >
                            {isHidden ? "👁‍🗨" : "👁"}
                          </button>
                          <button
                            type="button"
                            className={`layer-action ${isLocked ? "is-visible" : ""}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setLayerLocked(layer, !isLocked);
                              const fabricCanvas = fabricCanvasRef.current;
                              fabricCanvas?.requestRenderAll();
                              syncLayers();
                            }}
                            aria-label={isLocked ? "Unlock layer" : "Lock layer"}
                          >
                            {isLocked ? "🔒" : "🔓"}
                          </button>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {layerContextMenu && (
              <div
                className="layer-context-menu"
                style={{ top: layerContextMenu.y, left: layerContextMenu.x }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const fabricCanvas = fabricCanvasRef.current;
                    if (!fabricCanvas) return;
                    const target = fabricCanvas
                      .getObjects()
                      .find((obj) => obj.data?.id === layerContextMenu.layerId);
                    if (!target) return;
                    fabricCanvas.bringForward(target);
                    fabricCanvas.requestRenderAll();
                    syncLayers();
                    setLayerContextMenu(null);
                  }}
                >
                  Bring Forward
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fabricCanvas = fabricCanvasRef.current;
                    if (!fabricCanvas) return;
                    const target = fabricCanvas
                      .getObjects()
                      .find((obj) => obj.data?.id === layerContextMenu.layerId);
                    if (!target) return;
                    fabricCanvas.sendBackwards(target);
                    fabricCanvas.requestRenderAll();
                    syncLayers();
                    setLayerContextMenu(null);
                  }}
                >
                  Send Backward
                </button>
              </div>
            )}
            <div className="panel-divider"></div>
            <div className="panel-section">
              <button
                type="button"
                className="section-toggle"
                onClick={() => setPropertiesCollapsed((prev) => !prev)}
                aria-label="Toggle properties"
              >
                <span>Properties</span>
                <span className={`toggle-icon ${propertiesCollapsed ? "collapsed" : ""}`}>
                  ▼
                </span>
              </button>
              {!propertiesCollapsed && (
                <>
                  {getSelectedType() === "none" && (
                    <div className="empty-state">
                      <div className="empty-icon">▢</div>
                      <div>Select an element to edit its properties</div>
                    </div>
                  )}

                  {getSelectedType() !== "none" && selectedObject && (
                    <>
                      {getSelectedType() === "text" && (
                        <div className="prop-section">
                          <div className="section-title">Typography</div>
                          <div className="prop-row">
                            <label>Font</label>
                            <select
                              value={selectedObject.fontFamily || "Tilt Neon"}
                              onChange={(e) => updateObject({ fontFamily: e.target.value })}
                            >
                              {[
                                "Inter",
                                "Roboto",
                                "Poppins",
                                "Montserrat",
                                "Playfair Display",
                                "Dancing Script",
                                "Tilt Neon",
                                "Arial",
                              ].map((font) => (
                                <option key={font} value={font}>
                                  {font}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="prop-row two-col">
                            <div>
                              <label>Size</label>
                              <input
                                type="number"
                                value={Math.round(selectedObject.fontSize || 16)}
                                onChange={(e) => updateObject({ fontSize: Number(e.target.value) })}
                                onWheel={(e) =>
                                  onNumberWheel(
                                    e,
                                    selectedObject.fontSize || 16,
                                    1,
                                    (val) => updateObject({ fontSize: val })
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label>Line Height</label>
                              <input
                                type="number"
                                value={selectedObject.lineHeight || 1.2}
                                step="0.1"
                                onChange={(e) => updateObject({ lineHeight: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                          <div className="prop-row">
                            <label>Weight</label>
                            <select
                              value={selectedObject.fontWeight || "normal"}
                              onChange={(e) => updateObject({ fontWeight: e.target.value })}
                            >
                              {[
                                "100",
                                "200",
                                "300",
                                "400",
                                "500",
                                "600",
                                "700",
                                "800",
                              ].map((weight) => (
                                <option key={weight} value={weight}>
                                  {weight}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="prop-row">
                            <label>Letter Spacing</label>
                            <input
                              type="number"
                              value={selectedObject.charSpacing || 0}
                              onChange={(e) => updateObject({ charSpacing: Number(e.target.value) })}
                            />
                          </div>
                          <div className="toggle-row">
                            {["left", "center", "right", "justify"].map((align) => (
                              <button
                                key={align}
                                type="button"
                                className={selectedObject.textAlign === align ? "active" : ""}
                                onClick={() => updateObject({ textAlign: align })}
                              >
                                {align}
                              </button>
                            ))}
                          </div>
                          <div className="toggle-row">
                            <button
                              type="button"
                              className={selectedObject.underline ? "active" : ""}
                              onClick={() => updateObject({ underline: !selectedObject.underline })}
                            >
                              U
                            </button>
                            <button
                              type="button"
                              className={selectedObject.linethrough ? "active" : ""}
                              onClick={() =>
                                updateObject({ linethrough: !selectedObject.linethrough })
                              }
                            >
                              S
                            </button>
                            <button
                              type="button"
                              className={selectedObject.fontStyle === "italic" ? "active" : ""}
                              onClick={() =>
                                updateObject({
                                  fontStyle:
                                    selectedObject.fontStyle === "italic" ? "normal" : "italic",
                                })
                              }
                            >
                              I
                            </button>
                          </div>
                          <div className="prop-row">
                            <label>Text Color</label>
                            <div className="color-row">
                              <button
                                type="button"
                                className="swatch"
                                style={{ background: toHex(selectedObject.fill, "#ffffff") }}
                                onClick={() =>
                                  setActiveColorPicker(
                                    activeColorPicker === "text" ? null : "text"
                                  )
                                }
                              ></button>
                              <input
                                type="text"
                                value={toHex(selectedObject.fill, "#ffffff")}
                                onChange={(e) => updateObject({ fill: e.target.value })}
                              />
                            </div>
                            {activeColorPicker === "text" && (
                              <div className="color-picker-pop">
                                <ChromePicker
                                  color={toHex(selectedObject.fill, "#ffffff")}
                                  onChange={(color) => updateObject({ fill: color.hex })}
                                />
                              </div>
                            )}
                          </div>
                          <div className="toggle-row">
                            {["none", "uppercase", "lowercase", "capitalize"].map((transform) => (
                              <button key={transform} type="button">
                                {transform}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {getSelectedType() === "image" && (
                        <div className="prop-section">
                          <div className="section-title">Image</div>
                          <label>Border Radius</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={selectedObject.rx || 0}
                            onChange={(e) =>
                              updateObject({
                                rx: Number(e.target.value),
                                ry: Number(e.target.value),
                              })
                            }
                          />
                          <div className="toggle-row">
                            <button
                              type="button"
                              onClick={() => updateObject({ flipX: !selectedObject.flipX })}
                            >
                              Flip H
                            </button>
                            <button
                              type="button"
                              onClick={() => updateObject({ flipY: !selectedObject.flipY })}
                            >
                              Flip V
                            </button>
                          </div>
                          <label>Replace Image</label>
                          <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </div>
                      )}

                      <div className="prop-section">
                        <div className="section-title">Position</div>
                        <div className="align-row">
                          {[
                            ["left", "⟸"],
                            ["center", "↔"],
                            ["right", "⟹"],
                            ["top", "⟱"],
                            ["middle", "↕"],
                            ["bottom", "⟰"],
                          ].map(([key, icon]) => (
                            <button key={key} type="button" onClick={() => alignObject(key)}>
                              {icon}
                            </button>
                          ))}
                        </div>
                        <div className="prop-row two-col">
                          <div>
                            <label>X</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.left || 0)}
                              onChange={(e) => updateObject({ left: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label>Y</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.top || 0)}
                              onChange={(e) => updateObject({ top: Number(e.target.value) })}
                            />
                          </div>
                        </div>
                        <label>Rotation</label>
                        <input
                          type="number"
                          value={Math.round(selectedObject.angle || 0)}
                          onChange={(e) => updateObject({ angle: Number(e.target.value) })}
                        />
                        <div className="toggle-row">
                          <button
                            type="button"
                            onClick={() => updateObject({ flipX: !selectedObject.flipX })}
                          >
                            Flip H
                          </button>
                          <button
                            type="button"
                            onClick={() => updateObject({ flipY: !selectedObject.flipY })}
                          >
                            Flip V
                          </button>
                        </div>
                      </div>

                      <div className="prop-section">
                        <div className="section-title">Layout</div>
                        <div className="prop-row two-col">
                          <div>
                            <label>W</label>
                            <input
                              type="number"
                              value={getScaledSize(selectedObject).w}
                              onChange={(e) => setSize(selectedObject, Number(e.target.value), null)}
                            />
                          </div>
                          <div>
                            <label>H</label>
                            <input
                              type="number"
                              value={getScaledSize(selectedObject).h}
                              onChange={(e) => setSize(selectedObject, null, Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`aspect-toggle ${selectedObject.data?.lockAspect ? "active" : ""}`}
                          onClick={() =>
                            updateObject({
                              data: {
                                ...selectedObject.data,
                                lockAspect: !selectedObject.data?.lockAspect,
                              },
                            })
                          }
                        >
                          Aspect
                        </button>
                        {selectedObject.type === "rect" && (
                          <>
                            <label>Corner Radius</label>
                            <input
                              type="number"
                              value={selectedObject.rx || 0}
                              onChange={(e) =>
                                updateObject({
                                  rx: Number(e.target.value),
                                  ry: Number(e.target.value),
                                })
                              }
                            />
                          </>
                        )}
                      </div>

                      <div className="prop-section">
                        <div className="section-title">Appearance</div>
                        <label>Opacity</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Math.round((selectedObject.opacity ?? 1) * 100)}
                          onChange={(e) =>
                            updateObject({ opacity: Number(e.target.value) / 100 })
                          }
                        />
                        <label>Blend Mode</label>
                        <select
                          value={selectedObject.globalCompositeOperation || "source-over"}
                          onChange={(e) =>
                            updateObject({ globalCompositeOperation: e.target.value })
                          }
                        >
                          {[
                            ["source-over", "Normal"],
                            ["multiply", "Multiply"],
                            ["screen", "Screen"],
                            ["overlay", "Overlay"],
                            ["darken", "Darken"],
                            ["lighten", "Lighten"],
                          ].map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {(getSelectedType() === "shape" || getSelectedType() === "text") && (
                        <div className="prop-section">
                          <div className="section-title">Fill</div>
                          <div className="color-row">
                            <button
                              type="button"
                              className="swatch"
                              style={{
                                background: toHex(
                                  selectedObject.data?.fillColor || selectedObject.fill,
                                  "#ffffff"
                                ),
                              }}
                              onClick={() =>
                                setActiveColorPicker(
                                  activeColorPicker === "fill" ? null : "fill"
                                )
                              }
                            ></button>
                            <input
                              type="text"
                              value={toHex(
                                selectedObject.data?.fillColor || selectedObject.fill,
                                "#ffffff"
                              )}
                              onChange={(e) => {
                                applyFill(selectedObject, e.target.value);
                                fabricCanvasRef.current?.requestRenderAll();
                              }}
                            />
                            <input
                              type="number"
                              value={Math.round((selectedObject.data?.fillOpacity ?? 1) * 100)}
                              onChange={(e) =>
                                applyFill(
                                  selectedObject,
                                  selectedObject.data?.fillColor ||
                                    toHex(selectedObject.fill, "#ffffff"),
                                  Number(e.target.value) / 100
                                )
                              }
                            />
                            <button
                              type="button"
                              className="icon-btn"
                              onClick={() => toggleFillVisibility(selectedObject)}
                            >
                              👁
                            </button>
                          </div>
                          {activeColorPicker === "fill" && (
                            <div className="color-picker-pop">
                              <ChromePicker
                                color={toHex(
                                  selectedObject.data?.fillColor || selectedObject.fill,
                                  "#ffffff"
                                )}
                                onChange={(color) => {
                                  applyFill(selectedObject, color.hex);
                                  fabricCanvasRef.current?.requestRenderAll();
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {getSelectedType() !== "qr" && (
                        <div className="prop-section">
                          <div className="section-title">Stroke</div>
                          <div className="color-row">
                            <button
                              type="button"
                              className="swatch"
                              style={{
                                background: toHex(
                                  selectedObject.data?.strokeColor || selectedObject.stroke,
                                  "#ffffff"
                                ),
                              }}
                              onClick={() =>
                                setActiveColorPicker(
                                  activeColorPicker === "stroke" ? null : "stroke"
                                )
                              }
                            ></button>
                            <input
                              type="text"
                              value={toHex(
                                selectedObject.data?.strokeColor || selectedObject.stroke,
                                "#ffffff"
                              )}
                              onChange={(e) => {
                                applyStroke(selectedObject, e.target.value);
                                fabricCanvasRef.current?.requestRenderAll();
                              }}
                            />
                            <input
                              type="number"
                              value={Math.round((selectedObject.data?.strokeOpacity ?? 1) * 100)}
                              onChange={(e) =>
                                applyStroke(
                                  selectedObject,
                                  selectedObject.data?.strokeColor ||
                                    toHex(selectedObject.stroke, "#ffffff"),
                                  Number(e.target.value) / 100
                                )
                              }
                            />
                            <button
                              type="button"
                              className="icon-btn"
                              onClick={() => toggleStrokeVisibility(selectedObject)}
                            >
                              👁
                            </button>
                          </div>
                          {activeColorPicker === "stroke" && (
                            <div className="color-picker-pop">
                              <ChromePicker
                                color={toHex(
                                  selectedObject.data?.strokeColor || selectedObject.stroke,
                                  "#ffffff"
                                )}
                                onChange={(color) => {
                                  applyStroke(selectedObject, color.hex);
                                  fabricCanvasRef.current?.requestRenderAll();
                                }}
                              />
                            </div>
                          )}
                          <label>Stroke Width</label>
                          <input
                            type="number"
                            value={selectedObject.strokeWidth || 0}
                            onChange={(e) => updateObject({ strokeWidth: Number(e.target.value) })}
                          />
                          <label>Stroke Position</label>
                          <select defaultValue="center">
                            <option>Inside</option>
                            <option>Outside</option>
                            <option>Center</option>
                          </select>
                          <label>Stroke Style</label>
                          <select
                            value={
                              selectedObject.strokeDashArray ? "dashed" : "solid"
                            }
                            onChange={(e) =>
                              updateObject({
                                strokeDashArray:
                                  e.target.value === "dashed" ? [6, 6] : null,
                              })
                            }
                          >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                          </select>
                        </div>
                      )}

                      <div className="prop-section">
                        <div className="section-title">Effects</div>
                        <div className="toggle-row">
                          <button
                            type="button"
                            className={selectedObject.data?.shadow?.enabled ? "active" : ""}
                            onClick={() =>
                              setShadow(selectedObject, {
                                ...(selectedObject.data?.shadow || {}),
                                enabled: !selectedObject.data?.shadow?.enabled,
                              })
                            }
                          >
                            Drop Shadow
                          </button>
                          <button type="button">Inner Shadow</button>
                        </div>
                        {selectedObject.data?.shadow?.enabled && (
                          <>
                            <div className="prop-row two-col">
                              <div>
                                <label>X</label>
                                <input
                                  type="number"
                                  value={selectedObject.data?.shadow?.offsetX || 0}
                                  onChange={(e) =>
                                    setShadow(selectedObject, {
                                      ...(selectedObject.data?.shadow || {}),
                                      enabled: true,
                                      offsetX: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label>Y</label>
                                <input
                                  type="number"
                                  value={selectedObject.data?.shadow?.offsetY || 0}
                                  onChange={(e) =>
                                    setShadow(selectedObject, {
                                      ...(selectedObject.data?.shadow || {}),
                                      enabled: true,
                                      offsetY: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <label>Blur</label>
                            <input
                              type="number"
                              value={selectedObject.data?.shadow?.blur || 10}
                              onChange={(e) =>
                                setShadow(selectedObject, {
                                  ...(selectedObject.data?.shadow || {}),
                                  enabled: true,
                                  blur: Number(e.target.value),
                                })
                              }
                            />
                          </>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
      <div className="qr-staging" ref={qrCanvasRef}>
        <QRCodeCanvas
          key={qrValue}
          value={qrValue}
          size={180}
          level="H"
          imageSettings={{
            src: logo,
            height: 180 * 0.2,
            width: 180 * 0.2,
            excavate: true,
          }}
        />
      </div>
    </section>
  );
};

export default EventCardBuilder;
