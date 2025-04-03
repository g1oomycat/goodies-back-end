import { ArrayNotEmpty } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-cuid.validator';

export class DeleteBulkDto {
  @ArrayNotEmpty({ message: 'Список не может быть пустым' })
  @IsCuid({ each: true })
  ids: string[];
}
