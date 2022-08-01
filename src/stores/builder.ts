import type { ElementLadi } from "@/models/element.model";
import type { ISection } from "@/models/section.model";
import { defineStore } from "pinia";

export const useBuildStore = defineStore({
  id: "build-store",
  state: () => ({
    count: 10,
    sectionArray: [] as ISection[],
    sectionActiveIndex: null as unknown as number | null,
    elementActiveIndex: null as unknown as number | null,
    elementActive: null as ElementLadi | null,
  }),
  getters: {
    getSectionArray(state) {
      return state.sectionArray;
    },
    getCount(state) {
      return state.count;
    },
  },
  actions: {
    addNewSection(section: ISection) {
      this.sectionArray.push(section);
    },
    updateSectionIndexActive(index: number | null) {
      this.sectionActiveIndex = index;
    },
    updateSectionHeight(index: number, delta: number) {
      this.sectionArray[index].height += delta;
    },
    updateElementIndexActive(index: number | null) {
      this.elementActiveIndex = index;
    },
    updateElementTop(
      sectionIndex: number,
      elementIndex: number,
      deltalY: number
    ) {
      this.sectionArray;
    },

    updateIsEditting(
      sectionIndex: number,
      elementIndex: number,
      isEditting: boolean
    ) {
      this.sectionArray[sectionIndex].element[elementIndex].isEditting =
        isEditting;
    },

    updateDraggable(
      sectionIndex: number,
      elementIndex: number,
      draggable: boolean
    ) {
      this.sectionArray[sectionIndex].element[elementIndex].draggable =
        draggable;
    },

    updateIsHovering(
      sectionIndex: number,
      elementIndex: number,
      isHovering: boolean
    ) {
      this.sectionArray[sectionIndex].element[elementIndex].isHovering =
        isHovering;
    },

    addNewElement(data: { sectionIndex: number; element: ElementLadi }) {
      this.sectionArray[data.sectionIndex].element?.push(data.element);
    },
    updateCount(count: number) {
      this.count = count;
    },
  },
});
