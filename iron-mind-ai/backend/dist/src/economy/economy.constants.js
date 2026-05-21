"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEAVES_PER_WORKOUT = exports.WHEEL_SECTORS = exports.SHOP_ITEMS = void 0;
exports.shopItem = shopItem;
exports.wheelMultiplier = wheelMultiplier;
exports.rollWheel = rollWheel;
exports.isoDay = isoDay;
exports.yesterdayIso = yesterdayIso;
exports.SHOP_ITEMS = [
    { id: 'tree_skin_aurora', category: 'tree', price: 300 },
    { id: 'tree_skin_gold', category: 'tree', price: 500 },
    { id: 'tree_skin_neon_red', category: 'tree', price: 400 },
    { id: 'dumbbell_chrome', category: 'dumbbell', price: 200 },
    { id: 'dumbbell_gold', category: 'dumbbell', price: 450 },
    { id: 'accent_cyan', category: 'accent', price: 100 },
    { id: 'accent_pink', category: 'accent', price: 100 },
    { id: 'accent_amber', category: 'accent', price: 100 },
];
function shopItem(id) {
    return exports.SHOP_ITEMS.find((i) => i.id === id);
}
exports.WHEEL_SECTORS = [
    { value: 10, weight: 28 },
    { value: 25, weight: 22 },
    { value: 50, weight: 18 },
    { value: 75, weight: 14 },
    { value: 100, weight: 10 },
    { value: 200, weight: 5 },
    { value: 500, weight: 2 },
    { value: 1000, weight: 1 },
];
function wheelMultiplier(streakDays) {
    if (streakDays >= 7)
        return 2;
    if (streakDays >= 5)
        return 1.5;
    if (streakDays >= 3)
        return 1.25;
    return 1;
}
function rollWheel() {
    const total = exports.WHEEL_SECTORS.reduce((s, x) => s + x.weight, 0);
    let r = Math.random() * total;
    for (let i = 0; i < exports.WHEEL_SECTORS.length; i++) {
        r -= exports.WHEEL_SECTORS[i].weight;
        if (r <= 0)
            return i;
    }
    return 0;
}
exports.LEAVES_PER_WORKOUT = 25;
function isoDay(d = new Date()) {
    return d.toISOString().slice(0, 10);
}
function yesterdayIso() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
}
//# sourceMappingURL=economy.constants.js.map