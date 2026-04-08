<script setup name="App" lang="ts">
  import { onMounted, ref } from 'vue';
  import { useExplorerStore } from './stores/explorer';
  import {
    FolderTree,
    Search,
    HardDrive,
    FolderOpen,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    RotateCw,
    LayoutGrid,
    List,
  } from 'lucide-vue-next';
  import FolderTreeComponent from './components/FolderTree.vue';
  import MainPanel from './components/MainPanel.vue';

  const store = useExplorerStore();
  const viewMode = ref<'list' | 'grid'>('list');
  const searchQuery = ref('');

  const handleSearch = async () => {
    if (searchQuery.value.trim()) {
      await store.search(searchQuery.value.trim());
    }
  };

  const clearSearch = async () => {
    searchQuery.value = '';
    store.clearSearch();
    await store.fetchTree();
  };

  onMounted(() => {
    store.fetchTree();
  });
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-100">
    <!-- Header -->
    <header
      class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div class="rounded bg-blue-600 p-1.5 text-white">
          <HardDrive :size="20" />
        </div>
        <h1 class="text-lg font-semibold text-gray-900">File Explorer</h1>
      </div>

      <form @submit.prevent="handleSearch" class="relative w-72">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search :size="16" class="text-gray-400" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari file atau folder..."
          class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          v-if="searchQuery || store.isSearching"
          type="button"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          title="Clear search"
        >
          ×
        </button>

        <button type="submit" class="hidden">Search</button>
      </form>
    </header>

    <!-- Navigation Toolbar -->
    <nav class="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <button
        class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        title="Kembali"
      >
        <ChevronLeft :size="18" />
      </button>
      <button
        class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        title="Maju"
      >
        <ChevronRight :size="18" />
      </button>
      <button
        class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        title="Naik ke folder parent"
      >
        <ArrowUp :size="18" />
      </button>
      <button
        class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        title="Refresh"
      >
        <RotateCw :size="18" />
      </button>

      <div class="flex-1"></div>

      <!-- View Mode Toggle -->
      <div class="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button
          @click="viewMode = 'list'"
          :class="[
            'rounded p-1.5 transition-colors',
            viewMode === 'list'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
          title="Tampilan List"
        >
          <List :size="18" />
        </button>
        <button
          @click="viewMode = 'grid'"
          :class="[
            'rounded p-1.5 transition-colors',
            viewMode === 'grid'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
          title="Tampilan Grid"
        >
          <LayoutGrid :size="18" />
        </button>
      </div>
    </nav>

    <main class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
        <!-- Quick Access -->
        <div class="border-b border-gray-200 p-4">
          <h3 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Quick Access
          </h3>
          <nav class="space-y-1">
            <div
              class="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <HardDrive :size="16" class="text-blue-600" />
              <span>My Drive</span>
            </div>
            <div
              class="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FolderOpen :size="16" class="text-yellow-500" />
              <span>Documents</span>
            </div>
          </nav>
        </div>

        <!-- Folder Structure -->
        <div class="p-4">
          <h3 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Folders</h3>
          <nav>
            <ul class="space-y-1">
              <FolderTreeComponent v-for="folder in store.tree" :key="folder.id" :folder="folder" />
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Main Content Area -->
      <section class="flex flex-1 flex-col overflow-hidden bg-white">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-6 py-3 text-sm">
          <template v-if="store.isSearching">
            <Search :size="14" class="text-gray-600" />
            <span class="text-gray-600">Search results</span>
            <span v-if="searchQuery" class="text-gray-400">/</span>
            <span v-if="searchQuery" class="max-w-xs truncate font-medium text-blue-600">{{
              searchQuery
            }}</span>
          </template>
          <template v-else>
            <HardDrive :size="14" class="text-gray-600" />
            <span class="text-gray-600">My Drive</span>
            <span v-if="store.selectedFolderId" class="text-gray-400">/</span>
            <span v-if="store.selectedFolderId" class="truncate font-medium text-gray-800">{{
              store.selectedFolderId
            }}</span>
          </template>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <MainPanel
            :viewMode="viewMode"
            :content="store.isSearching ? store.searchResults : store.currentContent"
          />
        </div>
      </section>
    </main>

    <!-- Footer/Status Bar -->
    <footer
      class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 text-xs text-gray-600"
    >
      <div>
        <span v-if="store.isSearching">
          {{ store.searchResults.folders.length }} folder{{
            store.searchResults.folders.length !== 1 ? 's' : ''
          }}, {{ store.searchResults.files.length }} file{{
            store.searchResults.files.length !== 1 ? 's' : ''
          }}
        </span>
        <span v-else-if="store.selectedFolderId">
          {{ store.currentContent.folders.length }} folder{{
            store.currentContent.folders.length !== 1 ? 's' : ''
          }}, {{ store.currentContent.files.length }} file{{
            store.currentContent.files.length !== 1 ? 's' : ''
          }}
        </span>
        <span v-else>Pilih folder untuk melihat isinya</span>
      </div>
      <div class="text-right">
        <span>{{ store.selectedFolderId ? 'Ready' : 'Select a folder' }}</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>
