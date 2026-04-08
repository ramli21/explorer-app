<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-vue-next';
  import { useExplorerStore } from '../stores/explorer';

  // Mendefinisikan interface prop untuk folder
  interface FolderType {
    id: string;
    name: string;
    children?: FolderType[];
  }

  const props = defineProps<{
    folder: FolderType;
    depth?: number; // Untuk memberikan indentasi visual semakin dalam folder
  }>();

  const store = useExplorerStore();
  const isOpen = ref(false);
  const currentDepth = props.depth || 0;

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
    // Saat diklik, beri tahu store untuk mengambil konten di panel kanan
    store.selectFolder(props.folder.id);
  };

  const isSelected = computed(() => store.selectedFolderId === props.folder.id);
</script>

<template>
  <li>
    <div
      @click="handleToggle"
      class="flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition-colors duration-150 hover:bg-gray-200"
      :class="{ 'bg-blue-100 text-blue-700': isSelected }"
      :style="{ paddingLeft: `${currentDepth * 12 + 8}px` }"
    >
      <span class="w-4">
        <template v-if="folder.children && folder.children.length > 0">
          <ChevronDown v-if="isOpen" :size="14" />
          <ChevronRight v-else :size="14" />
        </template>
      </span>

      <component
        :is="isOpen ? FolderOpen : Folder"
        :size="16"
        :class="isSelected ? 'text-blue-600' : 'text-yellow-500'"
      />

      <span class="truncate text-sm">{{ folder.name }}</span>
    </div>

    <ul v-if="isOpen && folder.children && folder.children.length > 0">
      <FolderTree
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :depth="currentDepth + 1"
      />
    </ul>
  </li>
</template>
