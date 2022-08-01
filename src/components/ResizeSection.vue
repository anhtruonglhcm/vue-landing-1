<template>
    <div @click="$emit('on-add-section')" class="ladi-button-add-section ladi-font-default">
        Thêm mới Section
    </div>
    <div ref="moveHandle" @mousedown="handleMouseDown" class="ladi-resize-display">
        <i class="ladi-icon icon-cross-vertical ladi-resize-display-icon"></i>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useBuildStore } from '../stores/builder';
import { useResizeStore } from '../stores/resize';

export default defineComponent({
    emits: ["on-add-section"],
    setup() {
        const resizeStore = useResizeStore();
        const builderStore = useBuildStore();
        return {
            resizeStore,
            updateSectionHeight: builderStore.updateSectionHeight
        };
    },
    methods: {
        handleMouseMove(mouseMoveEvent: MouseEvent) {
            let deltaY = mouseMoveEvent.clientY - this.resizeStore.initialY;
            this.resizeStore.updateState({
                initialY: mouseMoveEvent.clientY
            })
            this.updateSectionHeight(0, deltaY);
        },
        handleMouseUp() {
            document.removeEventListener("mousemove", this.handleMouseMove);
            document.removeEventListener("mouseup", this.handleMouseUp);
        },
        handleMouseDown(mouseEvent: MouseEvent) {
            this.resizeStore.updateState({
                initialY: mouseEvent.clientY,
            });
            document.addEventListener("mousemove", this.handleMouseMove),
            document.addEventListener("mouseup", this.handleMouseUp)
        }
    }
})
</script>
