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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteOnboardingDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CompleteOnboardingDto {
    gender;
    age;
    heightCm;
    weightKg;
    activityLevel;
    goalKey;
    level;
    name;
}
exports.CompleteOnboardingDto = CompleteOnboardingDto;
__decorate([
    (0, class_validator_1.IsEnum)(['MALE', 'FEMALE', 'OTHER']),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "gender", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(110),
    __metadata("design:type", Number)
], CompleteOnboardingDto.prototype, "age", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(80),
    (0, class_validator_1.Max)(260),
    __metadata("design:type", Number)
], CompleteOnboardingDto.prototype, "heightCm", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(400),
    __metadata("design:type", Number)
], CompleteOnboardingDto.prototype, "weightKg", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE']),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "activityLevel", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['MASS', 'CUT', 'STRENGTH', 'ENDURANCE', 'ABS']),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "goalKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "name", void 0);
//# sourceMappingURL=complete-onboarding.dto.js.map