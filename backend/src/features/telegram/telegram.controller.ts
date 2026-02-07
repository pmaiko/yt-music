import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';

@Controller()
export class TelegramController {
  constructor(
    private readonly configService: ConfigService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get('/bot/me')
  async getMe() {
    const bot = this.telegramService.getBot();
    return await bot.getMe();
  }

  @Get('/bot/setWebHook/:url')
  async setWebHook(@Param('url') url?: string) {
    const bot = this.telegramService.getBot();
    try {
      await bot.setWebHook(
        `${url}/bot${this.configService.get('telegramBotToken')}`,
      );
      return this.getWebHookInfo();
    } catch (error: unknown) {
      return error;
    }
  }

  @Get('/bot/getWebHookInfo')
  async getWebHookInfo() {
    const bot = this.telegramService.getBot();
    return await bot.getWebHookInfo();
  }

  @Get('/bot/deleteWebHook')
  async deleteWebHook() {
    const bot = this.telegramService.getBot();
    return await bot.deleteWebHook();
  }

  @HttpCode(200)
  @Post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`)
  processUpdate(@Body() body: TelegramBot.Update) {
    const bot = this.telegramService.getBot();
    bot.processUpdate(body);
  }
}
