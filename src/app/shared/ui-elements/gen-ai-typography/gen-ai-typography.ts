import { Component, input } from '@angular/core';
import { Color, TypographySize } from './typography.models';

@Component({
  selector: 'genai-typography',
  imports: [],
  templateUrl: './gen-ai-typography.html',
  styleUrl: './gen-ai-typography.scss',
})
export class GenAITypography {
  readonly weight = input<300 | 400 | 500 | 600 | 700>(400);
  readonly name = input<TypographySize>();
  readonly color = input<Color>();
}
