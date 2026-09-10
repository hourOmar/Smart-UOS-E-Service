import React from 'react';

export interface CollegeItem {
  id: string;
  name: string;
  tagline: string;
  degreeTypes: string;
  gpaReq: string;
  gpaMet: boolean;
  foundationReq: string;
  foundationMet: boolean;
  clickable: boolean;
  programsCount: number;
}

export interface CommitteeMember {
  name: string;
  role: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  comment?: string;
  date?: string;
}

/**
 * `icon` is a JSX element chosen per-major in StudentProgramChangeMajorsPage.tsx.
 * That means the `majors` data array itself must stay in that component
 * (a plain .ts mock file cannot hold JSX) — only this type declaration
 * was safe to relocate here.
 */
export interface MajorItem {
  id: string;
  name: string;
  college: string;
  degree: string;
  creditsDuration: string;
  minGpa: string;
  currentGpa: string;
  gpaMet: boolean;
  foundation: string;
  foundationMet: boolean;
  prereq: string;
  prereqMet: boolean;
  icon: React.ReactNode;
}
