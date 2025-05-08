---
title: The box tool
---
# Introduction

This document will walk you through the implementation of the "box tool" in the codebase located at <SwmPath>[apps/…/utils/box.ts](/apps/desktop/src/utils/box.ts)</SwmPath>. The box tool is designed to manage and manipulate rectangular areas within a graphical interface.

We will cover:

1. How the box is instantiated and converted to bounds.
2. The resizing and scaling functionalities.
3. The constraints applied to maintain aspect ratio and boundaries.
4. The constraints applied to ensure size limits.

# Box instantiation and bounds conversion

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="14">

---

The box tool begins with the instantiation of a <SwmToken path="/apps/desktop/src/utils/box.ts" pos="32:22:22" line-data="  resize(newWidth: number, newHeight: number, origin: XY): Box {">`Box`</SwmToken> object. The constructor initializes the box with specific dimensions and position, which are crucial for defining the area it represents.

```
  private constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
```

---

</SwmSnippet>

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="25">

---

To facilitate interaction with other components, the box can be converted to a <SwmToken path="/apps/desktop/src/utils/box.ts" pos="25:6:6" line-data="  toBounds(): Bounds {">`Bounds`</SwmToken> object, which encapsulates its position and size.

```
  toBounds(): Bounds {
    return {
      position: { x: this.x, y: this.y },
      size: { x: this.width, y: this.height },
    };
  }
```

---

</SwmSnippet>

# Resizing and scaling functionalities

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="32">

---

The box tool provides methods to resize and scale the box. Resizing adjusts the box dimensions based on new width and height, while scaling modifies the size proportionally by a given factor.

```
  resize(newWidth: number, newHeight: number, origin: XY): Box {
    const fromX = this.x + this.width * origin.x;
    const fromY = this.y + this.height * origin.y;
```

---

</SwmSnippet>

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="44">

---

The <SwmToken path="/apps/desktop/src/utils/box.ts" pos="44:1:1" line-data="  scale(factor: number, origin: XY): Box {">`scale`</SwmToken> method leverages the <SwmToken path="/apps/desktop/src/utils/box.ts" pos="47:5:5" line-data="    return this.resize(newWidth, newHeight, origin);">`resize`</SwmToken> function to ensure the box dimensions are updated correctly according to the scaling factor.

```
  scale(factor: number, origin: XY): Box {
    const newWidth = this.width * factor;
    const newHeight = this.height * factor;
    return this.resize(newWidth, newHeight, origin);
  }
```

---

</SwmSnippet>

# Aspect ratio and boundary constraints

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="73">

---

To maintain visual consistency, the box tool can constrain the box to a specific aspect ratio. This is achieved by resizing the box while preserving the ratio, depending on whether the width or height should grow.

```
  constrainToRatio(
    ratio: number,
    origin: XY,
    grow: "width" | "height" = "height"
  ): Box {
    if (!ratio) return this;
```

---

</SwmSnippet>

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="90">

---

Boundary constraints ensure the box remains within specified limits. The box is resized if it exceeds these boundaries, using the <SwmToken path="/apps/desktop/src/utils/box.ts" pos="90:1:1" line-data="  constrainToBoundary(">`constrainToBoundary`</SwmToken> method.

```
  constrainToBoundary(
    boundaryWidth: number,
    boundaryHeight: number,
    origin: XY
  ): Box {
    const originPoint = this.getAbsolutePoint(origin);
```

---

</SwmSnippet>

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="131">

---

The method calculates maximum allowable dimensions based on the box's position and the boundary limits, ensuring the box does not exceed these constraints.

```
    if (this.width > maxWidth) {
      const factor = maxWidth / this.width;
      this.scale(factor, origin);
    }
    if (this.height > maxHeight) {
      const factor = maxHeight / this.height;
      this.scale(factor, origin);
    }
```

---

</SwmSnippet>

# Size constraints

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="143">

---

The box tool also applies constraints to ensure the box adheres to specified size limits. This includes maximum and minimum width and height constraints, which are adjusted based on the aspect ratio if provided.

```
  constrainToSize(
    maxWidth: number | null,
    maxHeight: number | null,
    minWidth: number | null,
    minHeight: number | null,
    origin: XY,
    ratio: number | null = null
  ): Box {
    if (ratio) {
      if (ratio > 1) {
        maxWidth = maxHeight ? maxHeight / ratio : maxWidth;
        minHeight = minWidth ? minWidth * ratio : minHeight;
      } else if (ratio < 1) {
        maxHeight = maxWidth ? maxWidth * ratio : maxHeight;
        minWidth = minHeight ? minHeight / ratio : minWidth;
      }
    }
```

---

</SwmSnippet>

<SwmSnippet path="/apps/desktop/src/utils/box.ts" line="161">

---

The method checks and adjusts the box dimensions to ensure they fall within the specified limits, resizing as necessary.

```
    if (maxWidth && this.width > maxWidth) {
      const newWidth = maxWidth;
      const newHeight = ratio === null ? this.height : maxHeight!;
      this.resize(newWidth, newHeight, origin);
    }
```

---

</SwmSnippet>

To summarize the constraints applied, here is a table detailing the conditions and actions taken:

| Constraint Type | Condition        | Action                        |
| --------------- | ---------------- | ----------------------------- |
| Aspect Ratio    | Ratio provided   | Resize to maintain ratio      |
| Boundary        | Exceeds boundary | Resize to fit within boundary |
| Max Size        | Exceeds max size | Resize to max dimensions      |
| Min Size        | Below min size   | Resize to min dimensions      |

This table provides a clear overview of how the box tool manages constraints to ensure the box remains within desired parameters.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ2FwJTNBJTNBSWRpdFllZ2VyU3dpbW0=" repo-name="Cap"><sup>Powered by [Swimm](https://staging.swimm.cloud/)</sup></SwmMeta>
