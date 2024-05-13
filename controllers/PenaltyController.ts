import { Response } from 'express';
import { checkSchema } from 'express-validator';
import XLSX from 'xlsx';
import { Op } from 'sequelize';
import { Request } from '../types/expressOverride';
import Penalty from '../models/Penalty';
import penaltyValidator from '../validators/penalty.validator';
import { handleExpressValidators } from '../utils/express.util';
import sequelize from '../sequelize-instance';

async function generateFilterAttributes(req: Request):Promise<any> {
  const filterAttributes: any = {};

  if (req.query.startDate || req.query.endDate) {
    filterAttributes[Op.and] = [
      req.query.startDate
        ? sequelize.where(
          sequelize.fn('DATE', sequelize.col('Penalty.datePenalty')),
          { [Op.gte]: req.query.startDate },
        ) : null,
      req.query.endDate
        ? sequelize.where(
          sequelize.fn('DATE', sequelize.col('Penalty.datePenalty')),
          { [Op.lte]: req.query.endDate },
        ) : null,
    ];
  }
  return filterAttributes;
}

export default {
  index: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;
      const limitQuery = limit === -1 ? {} : { limit };
      const whereFilter = await generateFilterAttributes(req);

      const penaltiesCount = await Penalty.findAndCountAll({
        where: whereFilter,
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

  exportInCSV: async (req:Request, res: Response) => {
    try {
      const filename = `Pénalité-${new Date().toISOString().replace(/:/g, '-')}.xlsx`;

      const whereFilter = await generateFilterAttributes(req);

      const penalties = await Penalty.findAll({
        where: whereFilter,
        raw: true,
        attributes: {
          exclude: ['updatedAt', 'deletedAt'],
        },
      });

      const penaltiesInitial = penalties.map((penalty) => ({
        id: penalty.id,
        compagnie: penalty.company,
        montant: penalty.amount,
        'montant/2': penalty.amount / 2,
        'montant/4': penalty.amount / 4,
        'montant/8': penalty.amount / 8,
      }));

      const penaltiesFirstPercent = penalties.map((penalty) => ({
        id: penalty.id,
        compagnie: penalty.company,
        montant: (penalty.amount) * (75 / 100),
        'montant/2': (penalty.amount) * (75 / 100 / 2),
        'montant/4': (penalty.amount) * (75 / 100 / 4),
        'montant/8': (penalty.amount) * (75 / 100 / 8),
      }));

      const penaltiesSecondPercent = penalties.map((penalty) => ({
        id: penalty.id,
        compagnie: penalty.company,
        montant: (penalty.amount) * (65 / 100),
        'montant/2': (penalty.amount) * (65 / 100 / 2),
        'montant/4': (penalty.amount) * (65 / 100 / 4),
        'montant/8': (penalty.amount) * (65 / 100 / 8),
      }));

      const penaltiesthirdPercent = penalties.map((penalty) => ({
        id: penalty.id,
        compagnie: penalty.company,
        montant: (penalty.amount) * (55 / 100),
        'montant/2': (penalty.amount) * (55 / 100 / 2),
        'montant/4': (penalty.amount) * (55 / 100 / 4),
        'montant/8': (penalty.amount) * (55 / 100 / 8),
      }));
      const penaltiesfourthPercent = penalties.map((penalty) => ({
        id: penalty.id,
        compagnie: penalty.company,
        montant: (penalty.amount) * (45 / 100),
        'montant/2': (penalty.amount) * (45 / 100 / 2),
        'montant/4': (penalty.amount) * (45 / 100 / 4),
        'montant/8': (penalty.amount) * (45 / 100 / 8),
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet1 = XLSX.utils.json_to_sheet(penaltiesInitial);
      XLSX.utils.book_append_sheet(workbook, worksheet1, 'Premier Tableau');

      const worksheet2 = XLSX.utils.json_to_sheet(penaltiesFirstPercent);
      XLSX.utils.book_append_sheet(workbook, worksheet2, 'Deuxieme Tableau');

      const worksheet3 = XLSX.utils.json_to_sheet(penaltiesSecondPercent);
      XLSX.utils.book_append_sheet(workbook, worksheet3, 'Troisième Tableau');

      const worksheet4 = XLSX.utils.json_to_sheet(penaltiesthirdPercent);
      XLSX.utils.book_append_sheet(workbook, worksheet4, 'Quatrième Tableau');

      const worksheet5 = XLSX.utils.json_to_sheet(penaltiesfourthPercent);
      XLSX.utils.book_append_sheet(workbook, worksheet5, 'Cinquième Tableau');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      res.send(excelBuffer);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
