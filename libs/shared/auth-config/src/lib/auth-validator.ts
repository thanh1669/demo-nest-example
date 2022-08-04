import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class AuthValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) { }

    transform<T>(data: T) {
        const { error, value } = this.schema.validate(
            data
        );
        if (error) {
            throw new HttpException(
                {
                    code: HttpStatus.BAD_REQUEST,
                    message: 'Validation Failed',
                    error
                },
                HttpStatus.BAD_REQUEST
            )
        }
        return value;
    }
}
