<template>
  <div
    :ref="itemElement.idText"
    :style="{
      width: itemElement.width + 'px',
      height: itemElement.height + 'px',
      top: itemElement.top + 'px',
      left: itemElement.left + 'px',
    }"
    class="ladi-element"
    @click="$event.stopPropagation()"
    @mousedown.stop="
      mouseDownElement(
        indexSection,
        indexElement,
        itemElement.isEditting,
        builderStore.elementActiveIndex,
        itemElement,
        $event
      )
    "
    @mouseenter="mouseEnterElement"
    @mouseleave="mouseLeaveElement"
  >
    <ButtonElement
      v-if="itemElement.elementType === menuChildEnum.BUTTON"
      :height="itemElement.height"
      :width="itemElement.width"
      :itemElement="itemElement"
      :indexSection="indexSection"
      :indexElement="indexElement"
      :isResizingEdge="itemElement.isResizingEdge"
      :applyCss="itemElement.applyCss"
      @on-update-draggable="updateDraggableElement"
    />
    <div
      v-if="itemElement.isHovering && !itemElement.isEditting"
      :data-id="itemElement.idText"
      data-locked="false"
      class="ladi-hover"
    ></div>
    <div
      v-if="itemElement.isResizingEdge"
      :data-id="itemElement.idText"
      data-locked="false"
      class="ladi-selected ladi-size"
      :data-size="itemElement.width + 'x' + itemElement.height"
    ></div>
    <div v-if="itemElement.isEditting" class="ladi-parent-selected-label">
      {{ itemElement.idText }}
    </div>
    <div v-if="itemElement.isEditting" class="ladi-parent-selected"></div>
    <template v-if="builderStore.elementActiveIndex === indexElement">
      <div
        @mousedown.stop="mouseDownResizeEdge(classResize, $event)"
        v-for="(classResize, index) of classResizes"
        :key="index"
        data-locked="false"
        class="ladi-resize"
        :class="classResize"
      >
        <div class="ladi-resize-display"></div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import ResizeEdge from "./ResizeEdge.vue";
import ButtonElement from "./ButtonElement.vue";
import { defineComponent } from "vue";
import { MenuChildAddNew } from "../constants/menu-left.constant";
import type { ElementLadi } from "../models/element.model";
import { useBuildStore } from "../stores/builder";
import { useResizeStore } from "../stores/resize";

export default defineComponent({
  components: {
    ResizeEdge,
    ButtonElement,
  },
  setup() {
    const builderStore = useBuildStore();
    const resizeStore = useResizeStore();
    return {
      builderStore,
      resizeStore,
    };
  },

  data() {
    return {
      menuChildEnum: MenuChildAddNew,
      classResizes: [
        "ladi-s-resize",
        "ladi-e-resize",
        "ladi-w-resize",
        "ladi-n-resize",
        "ladi-se-resize",
        "ladi-sw-resize",
        "ladi-nw-resize",
        "ladi-ne-resize",
      ],
    };
  },
  methods: {
    mouseDownElement(
      sectionIndex: number,
      elementIndex: number,
      isEditting: boolean | undefined,
      elementActiveIndex: number | null,
      itemElement: ElementLadi,
      mouseEvent: MouseEvent
    ) {
      this.builderStore.updateElementIndexActive(elementIndex);
      this.builderStore.updateSectionIndexActive(sectionIndex);
      if (!isEditting) {
        this.resizeStore.updateState({
          initialY: mouseEvent.clientY,
          initialX: mouseEvent.clientX,
        });
        document.addEventListener("mousemove", this.handleMouseMove),
          document.addEventListener("mouseup", this.handleMouseUp);
      }
    },
    handleMouseMove(mouseMoveEvent: MouseEvent) {
      let deltaY = mouseMoveEvent.clientY - this.resizeStore.initialY;
      let deltaX = mouseMoveEvent.clientX - this.resizeStore.initialX;
      this.resizeStore.updateState({
        initialY: mouseMoveEvent.clientY,
        initialX: mouseMoveEvent.clientX,
      });
      this.itemElement.top += deltaY;
      this.itemElement.left += deltaX;
    },
    handleMouseUp() {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },

    mouseEnterElement() {
      this.builderStore.updateIsHovering(
        this.indexSection,
        this.indexElement,
        true
      );
    },

    mouseLeaveElement() {
      this.builderStore.updateIsHovering(
        this.indexSection,
        this.indexElement,
        false
      );
    },

    mouseDownResizeEdge(classResize: string, mouseEvent: MouseEvent) {
      this.resizeStore.updateState({
        initialY: mouseEvent.clientY,
        initialX: mouseEvent.clientX,
        edgeResize: classResize,
      });
      document.addEventListener("mousemove", this.mouseMoveResizeEdge),
        document.addEventListener("mouseup", this.mouseResizeEdgeUp);
    },

    mouseMoveResizeEdge(mouseMoveEvent: MouseEvent) {
      let deltaY = mouseMoveEvent.clientY - this.resizeStore.initialY;
      let deltaX = mouseMoveEvent.clientX - this.resizeStore.initialX;
      this.resizeStore.updateState({
        initialY: mouseMoveEvent.clientY,
        initialX: mouseMoveEvent.clientX,
      });
      if (this.resizeStore.edgeResize === "ladi-e-resize") {
        this.itemElement.width += deltaX;
      }
      if (this.resizeStore.edgeResize === "ladi-s-resize") {
        this.itemElement.height += deltaY;
      }
      if (this.resizeStore.edgeResize === "ladi-w-resize") {
        this.itemElement.width -= deltaX;
        this.itemElement.left += deltaX;
      }
      if (this.resizeStore.edgeResize === "ladi-n-resize") {
        this.itemElement.height -= deltaY;
        this.itemElement.top += deltaY;
      }
      if (this.resizeStore.edgeResize === "ladi-se-resize") {
        this.itemElement.height += deltaY;
        this.itemElement.width += deltaX;
      }
      if (this.resizeStore.edgeResize === "ladi-sw-resize") {
        this.itemElement.width -= deltaX;
        this.itemElement.left += deltaX;
        this.itemElement.height += deltaY;
      }
      if (this.resizeStore.edgeResize === "ladi-nw-resize") {
        this.itemElement.width -= deltaX;
        this.itemElement.left += deltaX;
        this.itemElement.height -= deltaY;
        this.itemElement.top += deltaY;
      }
      if (this.resizeStore.edgeResize === "ladi-ne-resize") {
        this.itemElement.width += deltaX;
        this.itemElement.height -= deltaY;
        this.itemElement.top += deltaY;
      }
    },

    mouseResizeEdgeUp() {
      document.removeEventListener("mousemove", this.mouseMoveResizeEdge);
      document.removeEventListener("mouseup", this.mouseResizeEdgeUp);
    },

    updateDraggableElement(isDraggable: boolean) {
      if (!isDraggable) {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        this.builderStore.updateIsEditting(
          this.indexSection,
          this.indexElement,
          true
        );
        this.builderStore.updateDraggable(
          this.indexSection,
          this.indexElement,
          false
        );
      }
      if (isDraggable) {
        this.builderStore.updateIsEditting(
          this.indexSection,
          this.indexElement,
          false
        );
        this.builderStore.updateDraggable(
          this.indexSection,
          this.indexElement,
          true
        );
      }
    },
  },
  props: ["indexSection", "itemElement", "indexElement"],
});
</script>
