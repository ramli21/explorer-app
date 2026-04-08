<script setup lang="ts">
  import { Folder, FileText, Loader2 } from 'lucide-vue-next';
  import { useExplorerStore } from '../stores/explorer';

  interface Content {
    folders: any[];
    files: any[];
  }

  const props = defineProps<{
    content: Content;
    viewMode: 'list' | 'grid';
  }>();

  const store = useExplorerStore();

  const formatSize = (bytes: string | null) => {
    if (!bytes) return '0 KB';
    const kb = parseInt(bytes) / 1024;
    return kb.toFixed(1) + ' KB';
  };
</script>

<template>
  <div class="relative min-h-[200px]">
    <div
      v-if="store.loading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm"
    >
      <Loader2 class="animate-spin text-blue-600" :size="32" />
    </div>

    <div
      v-if="props.content.folders.length === 0 && props.content.files.length === 0"
      class="mt-20 text-center text-gray-400"
    >
      <Folder :size="48" class="mx-auto mb-2 opacity-20" />
      <p v-if="!store.isSearching">Pilih folder di sebelah kiri untuk melihat isi</p>
      <p v-else>Tidak ada hasil pencarian</p>
    </div>

    <div
      v-else
      :class="[
        'gap-4',
        props.viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          : 'divide-y divide-gray-200',
      ]"
    >
      <div
        v-for="subFolder in props.content.folders"
        :key="subFolder.id"
        @dblclick="store.selectFolder(subFolder.id)"
        class="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-blue-50"
      >
        <Folder
          :size="48"
          class="mb-2 text-yellow-500 transition-transform group-hover:scale-110"
        />
        <span class="w-full truncate text-center text-sm font-medium text-gray-900">{{
          subFolder.name
        }}</span>
      </div>

      <div
        v-for="file in props.content.files"
        :key="file.id"
        class="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-gray-50"
      >
        <FileText
          :size="48"
          class="mb-2 text-blue-400 transition-transform group-hover:scale-110"
        />
        <span class="w-full truncate text-center text-sm font-medium text-gray-900">{{
          file.name
        }}</span>
        <span class="mt-1 text-xs text-gray-500">{{ formatSize(file.sizeBytes) }}</span>
      </div>
    </div>
  </div>
</template>
