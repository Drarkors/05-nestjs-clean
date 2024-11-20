import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { BCryptHasher } from './bcrypt-hasher'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BCryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BCryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
