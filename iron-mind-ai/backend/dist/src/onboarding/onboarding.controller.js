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
exports.OnboardingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const onboarding_service_1 = require("./onboarding.service");
const complete_onboarding_dto_1 = require("./dto/complete-onboarding.dto");
let OnboardingController = class OnboardingController {
    onboarding;
    constructor(onboarding) {
        this.onboarding = onboarding;
    }
    preview(dto) {
        return this.onboarding.preview(dto);
    }
    complete(user, dto) {
        return this.onboarding.complete(user.id, dto);
    }
};
exports.OnboardingController = OnboardingController;
__decorate([
    (0, common_1.Post)('preview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complete_onboarding_dto_1.CompleteOnboardingDto]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complete_onboarding_dto_1.CompleteOnboardingDto]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "complete", null);
exports.OnboardingController = OnboardingController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('onboarding'),
    __metadata("design:paramtypes", [onboarding_service_1.OnboardingService])
], OnboardingController);
//# sourceMappingURL=onboarding.controller.js.map