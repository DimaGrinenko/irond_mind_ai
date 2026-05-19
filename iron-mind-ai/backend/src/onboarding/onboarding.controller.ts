import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { OnboardingService } from './onboarding.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';

@UseGuards(JwtGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboarding: OnboardingService) {}

  @Post('preview')
  preview(@Body() dto: CompleteOnboardingDto) {
    return this.onboarding.preview(dto);
  }

  @Post('complete')
  complete(@CurrentUser() user: CurrentUserPayload, @Body() dto: CompleteOnboardingDto) {
    return this.onboarding.complete(user.id, dto);
  }
}
