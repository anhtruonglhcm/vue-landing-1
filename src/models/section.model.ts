import type { ElementLadi } from "./element.model";

export interface ISection {
  id: number;
  idSection: string;
  height: number;
  element: ElementLadi[];
  preHeight: number;
}

export interface ISectionSubject {
  id: string;
  height: number;
}

export interface ISectitonSelectedId {
  id: string;
}
