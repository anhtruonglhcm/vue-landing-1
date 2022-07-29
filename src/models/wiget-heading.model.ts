import { TypeHeading } from '@constants/heading.constant';
import { IWigetCommon } from './wiget-common.model';

export interface IWigetHeading extends IWigetCommon {
  typeHeading?: TypeHeading;
  innerHtml?: string;
}
