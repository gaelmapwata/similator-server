import { Response } from 'express';
import { checkSchema } from 'express-validator';
import { Request } from '../types/expressOverride';
import Penalty from '../models/Penalty';
import penaltyValidator from '../validators/penalty.validator';
import { handleExpressValidators } from '../utils/express.util';

export default {
  index: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;
      const limitQuery = limit === -1 ? {} : { limit };

      const penaltiesCount = await Penalty.findAndCountAll({
        ...limitQuery,
        offset,
        order: ['company'],
        attributes: { exclude: ['userId'] },
      });

      const penaltiesSize = penaltiesCount.count;
      const totalPages = Math.ceil(penaltiesSize / limit);

      return res.status(200).json({
        data: penaltiesCount.rows,
        lastPage: totalPages,
        currentPage: page,
        limit,
        total: penaltiesSize,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  store: [
    checkSchema(penaltyValidator.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const penalty = await Penalty.create(
          {
            ...req.body,
            userId: req.userId,
          },
        );
        return res.status(201).json(penalty);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  show: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await Penalty.findByPk(id, {
        attributes: { exclude: ['userId'] },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  update: [
    checkSchema(penaltyValidator.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const { id } = req.params;

        await Penalty.update(
          req.body,
          {
            where: {
              id,
            },
            fields: Penalty.fillable,
          },
        );

        return res.status(200).json({ msg: 'success' });
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const penalty = await Penalty.destroy({
        where: { id },
      });
      res.status(200).json(penalty);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
