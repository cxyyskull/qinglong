import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import SubscriptionService from '../services/subscription';
import { celebrate, Joi } from 'celebrate';
import cron_parser from 'cron-parser';
const route = Router();

export default (app: Router) => {
  app.use('/subscriptions', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const subscriptionService = Container.get(SubscriptionService);
      const data = await subscriptionService.list(
        req.query.searchValue as string,
      );
      return res.send({ code: 200, data });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  route.post(
    '/',
    celebrate({
      body: Joi.object({
        type: Joi.string().required(),
        schedule: Joi.string().optional(),
        interval_schedule: Joi.object().optional(),
        name: Joi.string().optional(),
        url: Joi.string().required(),
        whitelist: Joi.string().optional(),
        blacklist: Joi.string().optional(),
        branch: Joi.string().optional(),
        dependences: Joi.string().optional(),
        status: Joi.number().optional(),
        pull_type: Joi.string().optional(),
        pull_option: Joi.object().optional(),
        schedule_type: Joi.string().required(),
        alias: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        if (cron_parser.parseExpression(req.body.schedule).hasNext()) {
          const subscriptionService = Container.get(SubscriptionService);
          const data = await subscriptionService.create(req.body);
          return res.send({ code: 200, data });
        } else {
          return res.send({ code: 400, message: 'param schedule error' });
        }
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/run',
    celebrate({
      body: Joi.array().items(Joi.number().required()),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.run(req.body);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/stop',
    celebrate({
      body: Joi.array().items(Joi.number().required()),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.stop(req.body);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/disable',
    celebrate({
      body: Joi.array().items(Joi.number().required()),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.disabled(req.body);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/enable',
    celebrate({
      body: Joi.array().items(Joi.number().required()),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.enabled(req.body);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/:id/log',
    celebrate({
      params: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request<{ id: number }>, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.log(req.params.id);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/',
    celebrate({
      body: Joi.object({
        type: Joi.string().required(),
        schedule: Joi.string().optional(),
        interval_schedule: Joi.object().optional(),
        name: Joi.string().optional(),
        url: Joi.string().required(),
        whitelist: Joi.string().optional(),
        blacklist: Joi.string().optional(),
        branch: Joi.string().optional(),
        dependences: Joi.string().optional(),
        status: Joi.number().optional(),
        pull_type: Joi.string().optional(),
        pull_option: Joi.object().optional(),
        schedule_type: Joi.string().optional(),
        alias: Joi.string().required(),
        id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        if (
          !req.body.schedule ||
          typeof req.body.schedule === 'object' ||
          cron_parser.parseExpression(req.body.schedule).hasNext()
        ) {
          const subscriptionService = Container.get(SubscriptionService);
          const data = await subscriptionService.update(req.body);
          return res.send({ code: 200, data });
        } else {
          return res.send({ code: 400, message: 'param schedule error' });
        }
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.delete(
    '/',
    celebrate({
      body: Joi.array().items(Joi.number().required()),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.remove(req.body);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/:id',
    celebrate({
      params: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request<{ id: number }>, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.getDb({ id: req.params.id });
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/status',
    celebrate({
      body: Joi.object({
        ids: Joi.array().items(Joi.number().required()),
        status: Joi.string().required(),
        pid: Joi.string().optional(),
        log_path: Joi.string().optional(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.status({
          ...req.body,
          status: parseInt(req.body.status),
          pid: parseInt(req.body.pid) || '',
        });
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/:id/logs',
    celebrate({
      params: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request<{ id: number }>, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const subscriptionService = Container.get(SubscriptionService);
        const data = await subscriptionService.logs(req.params.id);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
