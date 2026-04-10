import { defineStore } from 'pinia';
import axios from 'axios';

export const useExplorerStore = defineStore('explorer', {
  state: () => ({
    tree: [] as any[], // Data untuk panel kiri
    currentContent: {
      folders: [] as any[], // Data subfolder untuk panel kanan
      files: [] as any[], // Data file untuk panel kanan
    },
    searchResults: {
      folders: [] as any[],
      files: [] as any[],
    },
    isSearching: false,
    loading: false,
    selectedFolderId: null as string | null,
  }),
  actions: {
    async fetchTree() {
      const res = await axios.get('http://localhost:3000/api/folders/tree');

      this.tree = res.data;
    },
    async selectFolder(id: string) {
      this.isSearching = false;
      this.selectedFolderId = id;
      this.loading = true;
      try {
        const res = await axios.get(`http://localhost:3000/api/folders/${id}/content`);
        this.currentContent = res.data;
      } finally {
        this.loading = false;
      }
    },
    async search(query: string) {
      this.loading = true;
      this.isSearching = true;
      this.selectedFolderId = 'dd';
      try {
        const res = await axios.get(
          `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`,
        );
        this.searchResults = res.data;
      } finally {
        this.loading = false;
      }
    },
    clearSearch() {
      this.isSearching = false;
      this.searchResults = { folders: [], files: [] };
    },
  },
});
