import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import Penalty from '../models/Penalty';
import penaltyValidator from '../validators/penalty.validator';
import { handleExpressValidators } from '../utils/express.util';

export default {
  index: async (req: Request, res: Response) => {
    try {
      const penalties = await Penalty.findAll();

      res.status(200).json(penalties);
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

        const penalty = await Penalty.create(req.body);
        return res.status(201).json(penalty);
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
