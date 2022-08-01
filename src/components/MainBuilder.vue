<template>
  <div class="builder-border-left"></div>
  <div class="builder-border-right"></div>
  <div ui-view="left-menu">
    <MenuLeftVue @add-element="addElement" />
  </div>
  <div id="builder-editor" class="builder-editor">
    <div id="builder-mouse-hold" class="builder-mouse-hold ladi-hidden"></div>
    <div id="builder-container" class="builder-container ladi-wraper">
      <div v-for="
          (section, indexSection) of builderStore.sectionArray" :key="indexSection" :id="section.idSection"
        class="ladi-section" :style="{ height: section.height + 'px' }" @click="clickSection(indexSection)">
        <div class="ladi-section-background"></div>
        <div class="ladi-overlay"></div>
        <div class="ladi-container">
          <DragContainer v-for="(itemElement, indexElement) of section.element" :key="indexElement"
            :indexSection="indexSection" :itemElement="itemElement" :indexElement="indexElement"/>
        </div>
        <div v-if="builderStore.sectionActiveIndex === indexSection" class="ladi-resize ladi-s-resize">
          <ResizeSection
            @on-add-section="addNewSection(builderStore.sectionArray.length, builderStore.count, section.height, section.preHeight)" />
        </div>
      </div>
      <div id="SECTION_POPUP" class="ladi-section" style="height: 0px">
        <div class="ladi-section-background"></div>
        <div class="ladi-overlay"></div>
        <div class="ladi-container"></div>
      </div>
    </div>
    <div id="builder-preview" class="ladi-hidden"></div>
    <div v-if="builderStore.sectionArray.length == 0"
      @click="addNewSection(builderStore.sectionArray.length, builderStore.count, 0, 0)"
      class="builder-button-no-section">
      Thêm mới Section
    </div>
    <div id="backdrop-popup" class="backdrop-popup"></div>
    <div id="lightbox-screen" class="lightbox-screen"></div>
    <div id="builder-rotate-text" class="builder-rotate-text ladi-hidden"></div>
    <div id="builder-snap-grid" class="builder-grid ladi-hidden"></div>
  </div>
  <MenuRightVue></MenuRightVue>
</template>

<script lang="ts">
import MenuRightVue from './MenuRight.vue';
import MenuLeftVue from './MenuLeft.vue';
import ResizeSection from './ResizeSection.vue';
import DragContainer from './DragContainer.vue';
import { defineComponent } from 'vue'
import { MenuChildAddNew } from '../constants/menu-left.constant';
import { useBuildStore } from '../stores/builder';
import type { ElementLadi } from '../models/element.model';
import type { IWigetButton } from '../models/wiget-button.model';
import { BUTTON_DEFAULT } from '..//constants/element.constant';
import { CONTAINER_WIDTH_DESKTOP } from '..//constants/builder.constant';
import { useResizeStore } from '../stores/resize';

export default defineComponent({
  components: {
    MenuLeftVue,
    MenuRightVue,
    ResizeSection,
    DragContainer
  },
  mounted(){
    for(let i=0 ; i< 200; i++){
      this.addElement(MenuChildAddNew.BUTTON);
    }
  },
  setup() {
    const builderStore = useBuildStore();
    const resizeStore = useResizeStore();
    return {
      builderStore,
      resizeStore
    }
  },
  data() {
    return {
      menuChildEnum: MenuChildAddNew
    }
  },
  methods: {
    addElement(elementType: MenuChildAddNew) {
      if (this.builderStore.sectionArray.length === 0) {
        this.addNewSection(0, this.builderStore.count, 0, 0);
      }
      let item: ElementLadi | null = null;

      if (elementType === MenuChildAddNew.BUTTON) {
        item = this.createButton(this.builderStore.count);
      }

      // if (elementType === MenuChildAddNew.TITLE) {
      //   item = this._createHeading(count, sectionActiveIndex);
      // }

      // if (elementType === MenuChildAddNew.IMAGE) {
      //   item = this._createImage(count, sectionActiveIndex);
      // }

      this.builderStore.addNewElement({
        sectionIndex: this.builderStore.sectionActiveIndex || 0,
        element: item as ElementLadi,
      });
    },
    clickSection(index: number) {
      this.builderStore.updateSectionIndexActive(index);
      this.builderStore.updateElementIndexActive(null);
    },
    addNewSection(
      sectionArrayLength: number,
      count: number,
      sectionHeight: number,
      preSectionHeight: number,) {
      this.builderStore.addNewSection({
        id: count,
        idSection: `SECTION${count}`,
        height: 360,
        element: [],
        preHeight: sectionHeight + preSectionHeight,
      });
    },
    mouseDownElement(
      sectionIndex: number,
      elementIndex: number,
      isEditting: boolean | undefined,
      elementActiveIndex: number | null,
      itemElement: ElementLadi, mouseEvent: MouseEvent) {
      console.log(mouseEvent);
      this.builderStore.updateElementIndexActive(elementIndex);
      this.builderStore.updateSectionIndexActive(sectionIndex);
      if (!isEditting) {
        this.resizeStore.updateState({
          initialY: mouseEvent.clientY,
        });
        document.addEventListener("mousemove", this.handleMouseMove),
          document.addEventListener("mouseup", this.handleMouseUp)
      }
    },
    updateDraggableElement(event: any) {

    },
    updateIsEdittingElement(event: any) {

    },

    handleMouseMove(mouseMoveEvent: MouseEvent) {
      let deltaY = mouseMoveEvent.clientY - this.resizeStore.initialY;
      this.resizeStore.updateState({
        initialY: mouseMoveEvent.clientY
      });

    },
    handleMouseUp() {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },

    createButton(
      count: number,
    ): IWigetButton {
      this.builderStore.updateCount(++count);
      return {
        id: count,
        idText: `${MenuChildAddNew.BUTTON}${count}`,
        idSection: this.builderStore.sectionActiveIndex || 0,
        height: BUTTON_DEFAULT.HEIGHT,
        width: BUTTON_DEFAULT.WIDTH,
        top: 60,
        left: (CONTAINER_WIDTH_DESKTOP - BUTTON_DEFAULT.WIDTH) / 2,
        elementType: MenuChildAddNew.BUTTON,
        innerHtml: BUTTON_DEFAULT.INNER_HTML,
        draggable: true,
        isResizingEdge: false,
        isEditting: false,
        isHovering: false,
        applyCss: {
          color: 'rgb(255, 255, 255)',
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'center',
          lightHeight: 1.6,
        },
      };
    }
  }
})
</script>

<style scoped lang="scss">
.builder-border-left {
  left: calc((100% - 960px) / 2);
}

.builder-border-right {
  right: calc((100% - 960px) / 2);
}
</style>
