// SmartTree AI — shared localStorage utilities & monetization engine

const ST = {
  KEYS: {
    TREES: 'st_trees',
    REMINDERS: 'st_reminders',
    PROFILE: 'st_profile',
    PRO_LICENSE: 'st_pro_status'
  },

  getTrees() {
    return JSON.parse(localStorage.getItem(this.KEYS.TREES) || '[]');
  },
  saveTrees(arr) {
    localStorage.setItem(this.KEYS.TREES, JSON.stringify(arr));
  },
  addTree(tree) {
    const trees = this.getTrees();
    tree.id = Date.now().toString();
    tree.addedAt = new Date().toISOString();
    tree.growthLog = [];
    trees.push(tree);
    this.saveTrees(trees);
    return tree;
  },
  updateTree(id, patch) {
    const trees = this.getTrees().map(t => t.id === id ? { ...t, ...patch } : t);
    this.saveTrees(trees);
  },
  deleteTree(id) {
    this.saveTrees(this.getTrees().filter(t => t.id !== id));
  },
  getTree(id) {
    return this.getTrees().find(t => t.id === id) || null;
  },

  getReminders() {
    return JSON.parse(localStorage.getItem(this.KEYS.REMINDERS) || '[]');
  },
  saveReminders(arr) {
    localStorage.setItem(this.KEYS.REMINDERS, JSON.stringify(arr));
  },
  addReminder(r) {
    const list = this.getReminders();
    r.id = Date.now().toString();
    list.push(r);
    this.saveReminders(list);
  },
  dismissReminder(id) {
    this.saveReminders(this.getReminders().filter(r => r.id !== id));
  },

  // ── Monetization & Pro Licensing
  isProUser() {
    return localStorage.getItem(this.KEYS.PRO_LICENSE) === 'true';
  },
  activateProPlan(tierName) {
    localStorage.setItem(this.KEYS.PRO_LICENSE, 'true');
    localStorage.setItem('st_current_tier', tierName || 'Pro Tier');
  },
  deactivateProPlan() {
    localStorage.removeItem(this.KEYS.PRO_LICENSE);
    localStorage.removeItem('st_current_tier');
  },

  formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  healthBadge(status) {
    const map = {
      Healthy: 'badge-healthy',
      'Needs Water': 'badge-water',
      Unhealthy: 'badge-unhealthy',
      Unknown: 'badge-unknown',
    };
    return `<span class="badge ${map[status] || 'badge-unknown'}">${status}</span>`;
  },

  seedDemo() {
    if (this.getTrees().length > 0) return;
    const demos = [
      { species: 'Neem', location: 'College Campus (Varale)', soilType: 'Loamy', plantedDate: '2026-02-09', health: 'Healthy', waterEvery: 3, growth: 25, notes: 'Growing well near the main engineering building entrance.' },
      { species: 'Peepal', location: 'Roadside — Talegaon Highway', soilType: 'Sandy', plantedDate: '2026-03-15', health: 'Needs Water', waterEvery: 2, growth: 12, notes: 'Soil dry due to strong sun exposure. Extra watering required.' },
      { species: 'Mango', location: 'NGO Green Belt, Pune', soilType: 'Clay', plantedDate: '2026-01-20', health: 'Healthy', waterEvery: 4, growth: 40, notes: 'Healthy foliage; trunk thickening as expected.' },
    ];
    demos.forEach(d => this.addTree(d));

    this.addReminder({ treeId: null, message: 'Inspect soil and water Peepal tree along highway today.', dueDate: new Date().toISOString() });
  }
};