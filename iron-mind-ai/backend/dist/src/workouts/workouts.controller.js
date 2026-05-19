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
exports.WorkoutsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const workouts_service_1 = require("./workouts.service");
const create_workout_dto_1 = require("./dto/create-workout.dto");
const upsert_set_dto_1 = require("./dto/upsert-set.dto");
let WorkoutsController = class WorkoutsController {
    workouts;
    constructor(workouts) {
        this.workouts = workouts;
    }
    list(user, limit) {
        return this.workouts.list(user.id, limit ? Number(limit) : undefined);
    }
    create(user, dto) {
        return this.workouts.create(user.id, dto);
    }
    exerciseHistory(user, slug) {
        return this.workouts.exerciseHistory(user.id, slug);
    }
    exercise1rmSeries(user, slug) {
        return this.workouts.exercise1rmSeries(user.id, slug);
    }
    one(user, id) {
        return this.workouts.byId(user.id, id);
    }
    finish(user, id) {
        return this.workouts.finish(user.id, id);
    }
    upsertSet(user, id, dto) {
        return this.workouts.upsertSet(user.id, id, dto);
    }
};
exports.WorkoutsController = WorkoutsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkoutsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_workout_dto_1.CreateWorkoutDto]),
    __metadata("design:returntype", void 0)
], WorkoutsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('exercise-history/:slug'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkoutsController.prototype, "exerciseHistory", null);
__decorate([
    (0, common_1.Get)('exercise-1rm-series/:slug'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkoutsController.prototype, "exercise1rmSeries", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkoutsController.prototype, "one", null);
__decorate([
    (0, common_1.Patch)(':id/finish'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkoutsController.prototype, "finish", null);
__decorate([
    (0, common_1.Post)(':id/sets'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, upsert_set_dto_1.UpsertSetDto]),
    __metadata("design:returntype", void 0)
], WorkoutsController.prototype, "upsertSet", null);
exports.WorkoutsController = WorkoutsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('workouts'),
    __metadata("design:paramtypes", [workouts_service_1.WorkoutsService])
], WorkoutsController);
//# sourceMappingURL=workouts.controller.js.map