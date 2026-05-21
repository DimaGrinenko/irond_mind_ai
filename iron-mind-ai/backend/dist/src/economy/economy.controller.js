"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EconomyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const economy_service_1 = require("./economy.service");
const shop_item_dto_1 = require("./dto/shop-item.dto");
let EconomyController = class EconomyController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    wallet(user) {
        return this.svc.getWallet(user.id);
    }
    shop() {
        return this.svc.catalog();
    }
    spin(user) {
        return this.svc.spinWheel(user.id);
    }
    buy(user, dto) {
        return this.svc.buy(user.id, dto.itemId);
    }
    equip(user, dto) {
        return this.svc.equip(user.id, dto.itemId);
    }
    unequip(user, dto) {
        return this.svc.unequip(user.id, dto.itemId);
    }
};
exports.EconomyController = EconomyController;
__decorate([
    (0, common_1.Get)('wallet'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EconomyController.prototype, "wallet", null);
__decorate([
    (0, common_1.Get)('shop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EconomyController.prototype, "shop", null);
__decorate([
    (0, common_1.Post)('wheel/spin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EconomyController.prototype, "spin", null);
__decorate([
    (0, common_1.Post)('shop/buy'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, shop_item_dto_1.ShopItemDto]),
    __metadata("design:returntype", void 0)
], EconomyController.prototype, "buy", null);
__decorate([
    (0, common_1.Post)('shop/equip'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, shop_item_dto_1.ShopItemDto]),
    __metadata("design:returntype", void 0)
], EconomyController.prototype, "equip", null);
__decorate([
    (0, common_1.Post)('shop/unequip'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, shop_item_dto_1.ShopItemDto]),
    __metadata("design:returntype", void 0)
], EconomyController.prototype, "unequip", null);
exports.EconomyController = EconomyController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('economy'),
    __metadata("design:paramtypes", [economy_service_1.EconomyService])
], EconomyController);
//# sourceMappingURL=economy.controller.js.map