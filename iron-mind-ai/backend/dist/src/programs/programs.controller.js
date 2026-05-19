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
exports.ProgramsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const programs_service_1 = require("./programs.service");
const create_program_dto_1 = require("./dto/create-program.dto");
const update_program_dto_1 = require("./dto/update-program.dto");
const create_program_day_dto_1 = require("./dto/create-program-day.dto");
const update_program_day_dto_1 = require("./dto/update-program-day.dto");
const create_program_exercise_dto_1 = require("./dto/create-program-exercise.dto");
const update_program_exercise_dto_1 = require("./dto/update-program-exercise.dto");
const use_program_dto_1 = require("./dto/use-program.dto");
let ProgramsController = class ProgramsController {
    programs;
    constructor(programs) {
        this.programs = programs;
    }
    list(user) {
        return this.programs.list(user.id);
    }
    one(user, id) {
        return this.programs.byId(id, user.id);
    }
    create(user, dto) {
        return this.programs.create(user.id, dto);
    }
    clone(user, id) {
        return this.programs.clone(user.id, id);
    }
    update(user, id, dto) {
        return this.programs.update(user.id, id, dto);
    }
    remove(user, id) {
        return this.programs.remove(user.id, id);
    }
    use(user, id, dto) {
        return this.programs.use(user.id, id, dto);
    }
    addDay(user, id, dto) {
        return this.programs.addDay(user.id, id, dto);
    }
    updateDay(user, dayId, dto) {
        return this.programs.updateDay(user.id, dayId, dto);
    }
    removeDay(user, dayId) {
        return this.programs.removeDay(user.id, dayId);
    }
    addExercise(user, dayId, dto) {
        return this.programs.addExercise(user.id, dayId, dto);
    }
    updateExercise(user, exerciseId, dto) {
        return this.programs.updateExercise(user.id, exerciseId, dto);
    }
    removeExercise(user, exerciseId) {
        return this.programs.removeExercise(user.id, exerciseId);
    }
};
exports.ProgramsController = ProgramsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "one", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_program_dto_1.CreateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/clone'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "clone", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_program_dto_1.UpdateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/use'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, use_program_dto_1.UseProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "use", null);
__decorate([
    (0, common_1.Post)(':id/days'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_program_day_dto_1.CreateProgramDayDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "addDay", null);
__decorate([
    (0, common_1.Patch)('days/:dayId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_program_day_dto_1.UpdateProgramDayDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "updateDay", null);
__decorate([
    (0, common_1.Delete)('days/:dayId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dayId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "removeDay", null);
__decorate([
    (0, common_1.Post)('days/:dayId/exercises'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_program_exercise_dto_1.CreateProgramExerciseDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "addExercise", null);
__decorate([
    (0, common_1.Patch)('exercises/:exerciseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('exerciseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_program_exercise_dto_1.UpdateProgramExerciseDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "updateExercise", null);
__decorate([
    (0, common_1.Delete)('exercises/:exerciseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('exerciseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "removeExercise", null);
exports.ProgramsController = ProgramsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('programs'),
    __metadata("design:paramtypes", [programs_service_1.ProgramsService])
], ProgramsController);
//# sourceMappingURL=programs.controller.js.map