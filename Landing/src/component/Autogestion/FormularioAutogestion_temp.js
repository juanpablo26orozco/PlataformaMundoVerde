import React, { useState, useMemo, useEffect } from 'react';
import './FormularioAutogestion.css';
import ResumenGlobal from './ResumenGlobal';
import { useTranslation } from 'react-i18next';

import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import ModalPoliticas from '../Legal/ModalPoliticas';

// Utilidades de cÃ¡lculo
function selectionToScore(selection) {
  switch (selection) {
    case 'IMP': return 3;
    case 'M': return 2;
    case 'AC': return 1;
    case 'NA': return 0;
    default: return null;
  }
}

function averageIgnoringZeros(values) {
  const nums = values.filter(v => typeof v === 'number' && v > 0);
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function excelStyleFinalPercent(groupAverages, n) {
  const numericGroups = groupAverages.map(g => (typeof g === 'number' ? g : 0));
  const sum = numericGroups.reduce((a,b) => a + b, 0);
  const step1 = sum / n;
  const step2 = (step1 * 100) / n;
  return step2;
}

// FunciÃ³n para obtener el esquema de la secciÃ³n A con traducciÃ³n
const getSectionA = (t) => ({
  id: 'A',
  title: 'DiagnÃ³stico EconÃ³mico',
  finalFormulaDivisor: 7,
  blocks: [
    {
      id: 'A1',
            title: t('autogestion.form.blockTitles.A1'),
      questions: [
        { id: 'A_q_1', text: t('autogestion.form.questions.A_q_1') },
        { id: 'A_q_2', text: t('autogestion.form.questions.A_q_2') },
        { id: 'A_q_3', text: t('autogestion.form.questions.A_q_3') },
        { id: 'A_q_4', text: t('autogestion.form.questions.A_q_4') },
        { id: 'A_q_5', text: t('autogestion.form.questions.A_q_5') },
        { id: 'A_q_6', text: t('autogestion.form.questions.A_q_6') },
        { id: 'A_q_7', text: t('autogestion.form.questions.A_q_7') },
        { id: 'A_q_8', text: t('autogestion.form.questions.A_q_8') },
      ]
    },
    {
      id: 'A2',
            title: t('autogestion.form.blockTitles.A2'),
      questions: [
        { id: 'A_q_9', text: t('autogestion.form.questions.A_q_9') },
        { id: 'A_q_10', text: t('autogestion.form.questions.A_q_10') },
      ]
    },
    {
      id: 'A3',
            title: t('autogestion.form.blockTitles.A3'),
      questions: [
        { id: 'A_q_11', text: t('autogestion.form.questions.A_q_11') },
        { id: 'A_q_12', text: t('autogestion.form.questions.A_q_12') },
        { id: 'A_q_13', text: t('autogestion.form.questions.A_q_13') },
        { id: 'A_q_14', text: t('autogestion.form.questions.A_q_14') },
      ]
    },
    {
      id: 'A4',
            title: t('autogestion.form.blockTitles.A4'),
      questions: [
        { id: 'A_q_15', text: t('autogestion.form.questions.A_q_15') },
        { id: 'A_q_16', text: t('autogestion.form.questions.A_q_16') },
        { id: 'A_q_17', text: t('autogestion.form.questions.A_q_17') },
        { id: 'A_q_18', text: t('autogestion.form.questions.A_q_18') },
        { id: 'A_q_19', text: t('autogestion.form.questions.A_q_19') },
        { id: 'A_q_20', text: t('autogestion.form.questions.A_q_20') },
      ]
    },
    {
      id: 'A5',
            title: t('autogestion.form.blockTitles.A5'),
      questions: [
        { id: 'A_q_21', text: t('autogestion.form.questions.A_q_21') },
        { id: 'A_q_22', text: t('autogestion.form.questions.A_q_22') },
      ]
    },
    {
      id: 'A6',
            title: t('autogestion.form.blockTitles.A6'),
      questions: [
        { id: 'A_q_23', text: t('autogestion.form.questions.A_q_23') },
        { id: 'A_q_24', text: t('autogestion.form.questions.A_q_24') },
        { id: 'A_q_25', text: t('autogestion.form.questions.A_q_25') },
      ]
    },
    {
      id: 'A7',
            title: t('autogestion.form.blockTitles.A7'),
      questions: [
        { id: 'A_q_26', text: t('autogestion.form.questions.A_q_26') },
      ]
    },
  ]
});

// FunciÃ³n para obtener el esquema de la secciÃ³n B con traducciÃ³n
const getSectionB = (t) => ({
  id: 'B',
  title: 'GestiÃ³n Ambiental',
  finalFormulaDivisor: 6,
  blocks: [
    {
      id: 'B1',
            title: t('autogestion.form.blockTitles.B1'),
      questions: [
        { id: 'B_q_27', text: t('autogestion.form.questions.B_q_27') },
        { id: 'B_q_28', text: t('autogestion.form.questions.B_q_28') },
        { id: 'B_q_29', text: t('autogestion.form.questions.B_q_29') },
        { id: 'B_q_30', text: t('autogestion.form.questions.B_q_30') },
        { id: 'B_q_31', text: t('autogestion.form.questions.B_q_31') },
      ]
    },
    {
      id: 'B2',
            title: t('autogestion.form.blockTitles.B2'),
      questions: [
        { id: 'B_q_32', text: t('autogestion.form.questions.B_q_32') },
        { id: 'B_q_33', text: t('autogestion.form.questions.B_q_33') },
        { id: 'B_q_34', text: t('autogestion.form.questions.B_q_34') },
        { id: 'B_q_35', text: t('autogestion.form.questions.B_q_35') },
        { id: 'B_q_36', text: t('autogestion.form.questions.B_q_36') },
        { id: 'B_q_37', text: t('autogestion.form.questions.B_q_37') },
        { id: 'B_q_38', text: t('autogestion.form.questions.B_q_38') },
        { id: 'B_q_39', text: t('autogestion.form.questions.B_q_39') },
      ]
    },
    {
      id: 'B3',
            title: t('autogestion.form.blockTitles.B3'),
      questions: [
        { id: 'B_q_40', text: t('autogestion.form.questions.B_q_40') },
        { id: 'B_q_41', text: t('autogestion.form.questions.B_q_41') },
        { id: 'B_q_42', text: t('autogestion.form.questions.B_q_42') },
        { id: 'B_q_43', text: t('autogestion.form.questions.B_q_43') },
        { id: 'B_q_44', text: t('autogestion.form.questions.B_q_44') },
      ]
    },
    {
      id: 'B4',
            title: t('autogestion.form.blockTitles.B4'),
      questions: [
        { id: 'B_q_45', text: t('autogestion.form.questions.B_q_45') },
        { id: 'B_q_46', text: t('autogestion.form.questions.B_q_46') },
        { id: 'B_q_47', text: t('autogestion.form.questions.B_q_47') },
        { id: 'B_q_48', text: t('autogestion.form.questions.B_q_48') },
        { id: 'B_q_49', text: t('autogestion.form.questions.B_q_49') },
        { id: 'B_q_50', text: t('autogestion.form.questions.B_q_50') },
        { id: 'B_q_51', text: t('autogestion.form.questions.B_q_51') },
        { id: 'B_q_52', text: t('autogestion.form.questions.B_q_52') },
        { id: 'B_q_53', text: t('autogestion.form.questions.B_q_53') },
        { id: 'B_q_54', text: t('autogestion.form.questions.B_q_54') },
        { id: 'B_q_55', text: t('autogestion.form.questions.B_q_55') },
        { id: 'B_q_56', text: t('autogestion.form.questions.B_q_56') },
      ]
    },
    {
      id: 'B5',
            title: t('autogestion.form.blockTitles.B5'),
      questions: [
        { id: 'B_q_57', text: t('autogestion.form.questions.B_q_57') },
        { id: 'B_q_58', text: t('autogestion.form.questions.B_q_58') },
        { id: 'B_q_59', text: t('autogestion.form.questions.B_q_59') },
        { id: 'B_q_60', text: t('autogestion.form.questions.B_q_60') },
        { id: 'B_q_61', text: t('autogestion.form.questions.B_q_61') },
        { id: 'B_q_62', text: t('autogestion.form.questions.B_q_62') },
        { id: 'B_q_63', text: t('autogestion.form.questions.B_q_63') },
        { id: 'B_q_64', text: t('autogestion.form.questions.B_q_64') },
        { id: 'B_q_65', text: t('autogestion.form.questions.B_q_65') },
        { id: 'B_q_66', text: t('autogestion.form.questions.B_q_66') },
        { id: 'B_q_67', text: t('autogestion.form.questions.B_q_67') },
        { id: 'B_q_68', text: t('autogestion.form.questions.B_q_68') },
        { id: 'B_q_69', text: t('autogestion.form.questions.B_q_69') },
        { id: 'B_q_70', text: t('autogestion.form.questions.B_q_70') },
        { id: 'B_q_71', text: t('autogestion.form.questions.B_q_71') },
        { id: 'B_q_72', text: t('autogestion.form.questions.B_q_72') },
        { id: 'B_q_73', text: t('autogestion.form.questions.B_q_73') },
        { id: 'B_q_74', text: t('autogestion.form.questions.B_q_74') },
        { id: 'B_q_75', text: t('autogestion.form.questions.B_q_75') },
        { id: 'B_q_76', text: t('autogestion.form.questions.B_q_76') },
        { id: 'B_q_77', text: t('autogestion.form.questions.B_q_77') },
        { id: 'B_q_78', text: t('autogestion.form.questions.B_q_78') },
        { id: 'B_q_79', text: t('autogestion.form.questions.B_q_79') },
        { id: 'B_q_80', text: t('autogestion.form.questions.B_q_80') },
        { id: 'B_q_81', text: t('autogestion.form.questions.B_q_81') },
        { id: 'B_q_82', text: t('autogestion.form.questions.B_q_82') },
        { id: 'B_q_83', text: t('autogestion.form.questions.B_q_83') },
        { id: 'B_q_84', text: t('autogestion.form.questions.B_q_84') },
        { id: 'B_q_85', text: t('autogestion.form.questions.B_q_85') },
        { id: 'B_q_86', text: t('autogestion.form.questions.B_q_86') },
        { id: 'B_q_87', text: t('autogestion.form.questions.B_q_87') },
        { id: 'B_q_88', text: t('autogestion.form.questions.B_q_88') },
        { id: 'B_q_89', text: t('autogestion.form.questions.B_q_89') },
        { id: 'B_q_90', text: t('autogestion.form.questions.B_q_90') },
        { id: 'B_q_91', text: t('autogestion.form.questions.B_q_91') },
      ]
    },
    {
      id: 'B6',
            title: t('autogestion.form.blockTitles.B6'),
      questions: [
        { id: 'B_q_92', text: t('autogestion.form.questions.B_q_92') },
        { id: 'B_q_93', text: t('autogestion.form.questions.B_q_93') },
        { id: 'B_q_94', text: t('autogestion.form.questions.B_q_94') },
        { id: 'B_q_95', text: t('autogestion.form.questions.B_q_95') },
        { id: 'B_q_96', text: t('autogestion.form.questions.B_q_96') },
        { id: 'B_q_97', text: t('autogestion.form.questions.B_q_97') },
        { id: 'B_q_98', text: t('autogestion.form.questions.B_q_98') },
        { id: 'B_q_99', text: t('autogestion.form.questions.B_q_99') },
        { id: 'B_q_100', text: t('autogestion.form.questions.B_q_100') },
        { id: 'B_q_101', text: t('autogestion.form.questions.B_q_101') },
        { id: 'B_q_102', text: t('autogestion.form.questions.B_q_102') },
        { id: 'B_q_103', text: t('autogestion.form.questions.B_q_103') },
      ]
    },
  ]
});

// FunciÃ³n para obtener el esquema de la secciÃ³n C con traducciÃ³n
const getSectionC = (t) => ({
  id: 'C',
  title: 'GestiÃ³n EnergÃ­a',
  finalFormulaDivisor: 3,
  blocks: [
    {
      id: 'C1',
            title: t('autogestion.form.blockTitles.C1'),
      questions: [
        { id: 'C_q_104', text: t('autogestion.form.questions.C_q_104') },
        { id: 'C_q_105', text: t('autogestion.form.questions.C_q_105') },
        { id: 'C_q_106', text: t('autogestion.form.questions.C_q_106') },
        { id: 'C_q_107', text: t('autogestion.form.questions.C_q_107') },
        { id: 'C_q_108', text: t('autogestion.form.questions.C_q_108') },
        { id: 'C_q_109', text: t('autogestion.form.questions.C_q_109') },
        { id: 'C_q_110', text: t('autogestion.form.questions.C_q_110') },
        { id: 'C_q_111', text: t('autogestion.form.questions.C_q_111') },
      ]
    },
    {
      id: 'C2',
            title: t('autogestion.form.blockTitles.C2'),
      questions: [
        { id: 'C_q_112', text: t('autogestion.form.questions.C_q_112') },
        { id: 'C_q_113', text: t('autogestion.form.questions.C_q_113') },
        { id: 'C_q_114', text: t('autogestion.form.questions.C_q_114') },
        { id: 'C_q_115', text: t('autogestion.form.questions.C_q_115') },
        { id: 'C_q_116', text: t('autogestion.form.questions.C_q_116') },
      ]
    },
    {
      id: 'C3',
            title: t('autogestion.form.blockTitles.C3'),
      questions: [
        { id: 'C_q_117', text: t('autogestion.form.questions.C_q_117') },
        { id: 'C_q_118', text: t('autogestion.form.questions.C_q_118') },
        { id: 'C_q_119', text: t('autogestion.form.questions.C_q_119') },
      ]
    },
  ]
});

// FunciÃ³n para obtener el esquema de la secciÃ³n D con traducciÃ³n
const getSectionD = (t) => ({
  id: 'D',
  title: 'Seguridad y Salud en el Trabajo',
  finalFormulaDivisor: 10,
  blocks: [
    {
      id: 'D1',
            title: t('autogestion.form.blockTitles.D1'),
      questions: [
        { id: 'D_q_120', text: t('autogestion.form.questions.D_q_120') },
      ]
    },
    {
      id: 'D2',
            title: t('autogestion.form.blockTitles.D2'),
      questions: [
        { id: 'D_q_121', text: t('autogestion.form.questions.D_q_121') },
        { id: 'D_q_122', text: t('autogestion.form.questions.D_q_122') },
        { id: 'D_q_123', text: t('autogestion.form.questions.D_q_123') },
      ]
    },
    {
      id: 'D3',
            title: t('autogestion.form.blockTitles.D3'),
      questions: [
        { id: 'D_q_124', text: t('autogestion.form.questions.D_q_124') },
        { id: 'D_q_125', text: t('autogestion.form.questions.D_q_125') },
      ]
    },
    {
      id: 'D4',
            title: t('autogestion.form.blockTitles.D4'),
      questions: [
        { id: 'D_q_126', text: t('autogestion.form.questions.D_q_126') },
        { id: 'D_q_127', text: t('autogestion.form.questions.D_q_127') },
        { id: 'D_q_128', text: t('autogestion.form.questions.D_q_128') },
        { id: 'D_q_129', text: t('autogestion.form.questions.D_q_129') },
        { id: 'D_q_130', text: t('autogestion.form.questions.D_q_130') },
      ]
    },
    {
      id: 'D5',
            title: t('autogestion.form.blockTitles.D5'),
      questions: [
        { id: 'D_q_131', text: t('autogestion.form.questions.D_q_131') },
        { id: 'D_q_132', text: t('autogestion.form.questions.D_q_132') },
        { id: 'D_q_133', text: t('autogestion.form.questions.D_q_133') },
        { id: 'D_q_134', text: t('autogestion.form.questions.D_q_134') },
      ]
    },
    {
      id: 'D6',
            title: t('autogestion.form.blockTitles.D6'),
      questions: [
        { id: 'D_q_135', text: t('autogestion.form.questions.D_q_135') },
        { id: 'D_q_136', text: t('autogestion.form.questions.D_q_136') },
        { id: 'D_q_137', text: t('autogestion.form.questions.D_q_137') },
        { id: 'D_q_138', text: t('autogestion.form.questions.D_q_138') },
        { id: 'D_q_139', text: t('autogestion.form.questions.D_q_139') },
      ]
    },
    {
      id: 'D7',
            title: t('autogestion.form.blockTitles.D7'),
      questions: [
        { id: 'D_q_140', text: t('autogestion.form.questions.D_q_140') },
      ]
    },
    {
      id: 'D8',
            title: t('autogestion.form.blockTitles.D8'),
      questions: [
        { id: 'D_q_141', text: t('autogestion.form.questions.D_q_141') },
        { id: 'D_q_142', text: t('autogestion.form.questions.D_q_142') },
        { id: 'D_q_143', text: t('autogestion.form.questions.D_q_143') },
        { id: 'D_q_144', text: t('autogestion.form.questions.D_q_144') },
      ]
    },
    {
      id: 'D9',
            title: t('autogestion.form.blockTitles.D9'),
      questions: [
        { id: 'D_q_145', text: t('autogestion.form.questions.D_q_145') },
        { id: 'D_q_146', text: t('autogestion.form.questions.D_q_146') },
        { id: 'D_q_147', text: t('autogestion.form.questions.D_q_147') },
        { id: 'D_q_148', text: t('autogestion.form.questions.D_q_148') },
        { id: 'D_q_149', text: t('autogestion.form.questions.D_q_149') },
      ]
    },
    {
      id: 'D10',
            title: t('autogestion.form.blockTitles.D10'),
      questions: [
        { id: 'D_q_150', text: t('autogestion.form.questions.D_q_150') },
        { id: 'D_q_151', text: t('autogestion.form.questions.D_q_151') },
        { id: 'D_q_152', text: t('autogestion.form.questions.D_q_152') },
        { id: 'D_q_153', text: t('autogestion.form.questions.D_q_153') },
      ]
    },
  ]
});

// FunciÃ³n para obtener el esquema de la secciÃ³n E con traducciÃ³n
const getSectionE = (t) => ({
  id: 'E',
  title: 'DiagnÃ³stico Aspectos Sociales',
  finalFormulaDivisor: 4,
  blocks: [
    {
      id: 'E1',
            title: t('autogestion.form.blockTitles.E1'),
      questions: [
        { id: 'E_q_1', text: t('autogestion.form.questions.E_q_1') },
        { id: 'E_q_2', text: t('autogestion.form.questions.E_q_2') },
        { id: 'E_q_3', text: t('autogestion.form.questions.E_q_3') },
      ]
    },
    {
      id: 'E2',
            title: t('autogestion.form.blockTitles.E2'),
      questions: [
        { id: 'E_q_4', text: t('autogestion.form.questions.E_q_4') },
        { id: 'E_q_5', text: t('autogestion.form.questions.E_q_5') },
        { id: 'E_q_6', text: t('autogestion.form.questions.E_q_6') },
      ]
    },
    {
      id: 'E3',
            title: t('autogestion.form.blockTitles.E3'),
      questions: [
        { id: 'E_q_7', text: t('autogestion.form.questions.E_q_7') },
        { id: 'E_q_8', text: t('autogestion.form.questions.E_q_8') },
        { id: 'E_q_9', text: t('autogestion.form.questions.E_q_9') },
      ]
    },
  ]
});

// FunciÃ³n para obtener el esquema de la secciÃ³n F con traducciÃ³n
const getSectionF = (t) => ({
  id: 'F',
  title: 'DiagnÃ³stico AlmacÃ©n',
  finalFormulaDivisor: 3,
  blocks: [
    {
      id: 'F1',
            title: t('autogestion.form.blockTitles.F1'),
      questions: [
        { id: 'F_q_195', text: t('autogestion.form.questions.F_q_195') },
        { id: 'F_q_196', text: t('autogestion.form.questions.F_q_196') },
        { id: 'F_q_197', text: t('autogestion.form.questions.F_q_197') },
        { id: 'F_q_198', text: t('autogestion.form.questions.F_q_198') },
        { id: 'F_q_199', text: t('autogestion.form.questions.F_q_199') },
      ]
    },
    {
      id: 'F2',
            title: t('autogestion.form.blockTitles.F2'),
      questions: [
        { id: 'F_q_200', text: t('autogestion.form.questions.F_q_200') },
        { id: 'F_q_201', text: t('autogestion.form.questions.F_q_201') },
        { id: 'F_q_202', text: t('autogestion.form.questions.F_q_202') },
        { id: 'F_q_203', text: t('autogestion.form.questions.F_q_203') },
      ]
    },
    {
      id: 'F3',
            title: t('autogestion.form.blockTitles.F3'),
      questions: [
        { id: 'F_q_204', text: t('autogestion.form.questions.F_q_204') },
        { id: 'F_q_205', text: t('autogestion.form.questions.F_q_205') },
        { id: 'F_q_206', text: t('autogestion.form.questions.F_q_206') },
        { id: 'F_q_207', text: t('autogestion.form.questions.F_q_207') },
        { id: 'F_q_208', text: t('autogestion.form.questions.F_q_208') },
        { id: 'F_q_209', text: t('autogestion.form.questions.F_q_209') },
        { id: 'F_q_210', text: t('autogestion.form.questions.F_q_210') },
      ]
    },
  ]
});

const getOptions = (t) => [
  { value: 'IMP', label: t('autogestion.form.options.important'), score: 3 },
  { value: 'M', label: t('autogestion.form.options.medium'), score: 2 },
  { value: 'AC', label: t('autogestion.form.options.acceptable'), score: 1 },
  { value: 'NA', label: t('autogestion.form.options.notApplicable'), score: 0 },
];

const getOptionsE = (t) => [
  { value: 'Siempre', label: t('autogestion.form.options.always'), score: 3 },
  { value: 'Casi siempre', label: t('autogestion.form.options.almostAlways'), score: 2 },
  { value: 'Algunas veces', label: t('autogestion.form.options.sometimes'), score: 1 },
  { value: 'Nunca', label: t('autogestion.form.options.never'), score: 0 },
];

const getSectionSteps = (t) => [
  { key: 'A', label: t('autogestion.form.sections.economicDiagnosis'), color: '#e8f5e9', gradient: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' },
  { key: 'B', label: t('autogestion.form.sections.environmentalManagement'), color: '#e3f2fd', gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' },
  { key: 'C', label: t('autogestion.form.sections.energyManagement'), color: '#f1f8e9', gradient: 'linear-gradient(135deg, #f1f8e9 0%, #c8e6c9 100%)' },
  { key: 'D', label: t('autogestion.form.sections.occupationalSafety'), color: '#f3e5f5', gradient: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)' },
  { key: 'E', label: t('autogestion.form.sections.socialDiagnosis'), color: '#fffde7', gradient: 'linear-gradient(135deg, #fffde7 0%, #ffe082 100%)' },
  { key: 'F', label: t('autogestion.form.sections.warehouseDiagnosis'), color: '#f9fbe7', gradient: 'linear-gradient(135deg, #f9fbe7 0%, #fffde7 100%)' },
];

const FormularioAutogestion = ({ noCard = false }) => {
  const { t } = useTranslation();
  const sectionSteps = getSectionSteps(t);
  const options = getOptions(t);
  const optionsE = getOptionsE(t);
  const sectionA = getSectionA(t);
  const sectionB = getSectionB(t);
  const sectionC = getSectionC(t);
  const sectionD = getSectionD(t);
  const sectionE = getSectionE(t);
  const sectionF = getSectionF(t);
  
  // Estado para datos de empresa (debe ir antes de cualquier uso)
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombreEmpresa: "",
    nit: "",
    direccion: "",
    departamento: "",
    municipio: "",
    aÃ±oBase: "",
    fechaReporte: "",
    telefono: "",
    correo: "",
    personaElabora: "",
    cargo: ""
  });

  // Importar datos de departamentos y municipios
  const departamentosMunicipios = require('../../data/departamentos_municipios.json');
  const departamentos = departamentosMunicipios.map(d => d.departamento);
  const municipiosFiltrados = datosEmpresa.departamento
    ? (departamentosMunicipios.find(d => d.departamento === datosEmpresa.departamento)?.municipios || [])
    : [];
  // Estado para datos de empresa
  
  // Handler para datos de empresa
  function handleEmpresaChange(e) {
    const { name, value } = e.target;
    setDatosEmpresa(prev => ({ ...prev, [name]: value }));
  }
  // Estado para error de validaciÃ³n
  const [stepError, setStepError] = useState("");
  // Estado para mostrar el modal de error
  const [showErrorModal, setShowErrorModal] = useState(false);
  // Estado de respuestas
  const [answers, setAnswers] = useState({});
  const [answersE, setAnswersE] = useState({});
  const [answersF, setAnswersF] = useState({});

  // Estado para preguntas faltantes
  const [missingQuestions, setMissingQuestions] = useState([]);

  // Estados para guardado en base de datos
  const [codigoSeguimiento, setCodigoSeguimiento] = useState('');
  const [guardandoDatos, setGuardandoDatos] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);

  // Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = A, 1 = B, ...
  
  // Estado para modal de polÃ­ticas
  const [showModalPoliticas, setShowModalPoliticas] = useState(false);
  const [consentimientoAceptado, setConsentimientoAceptado] = useState(false);

  // Verificar si el usuario ya aceptÃ³ el consentimiento
  useEffect(() => {
    const consentimiento = localStorage.getItem('consentimientoAceptado');
    if (consentimiento === 'true') {
      setConsentimientoAceptado(true);
    }
  }, []);
  // Mapeo de respuestas a score secciÃ³n F
  const scoresF = useMemo(() => {
    const out = {};
    sectionF.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answersF[q.id]);
      });
    });
    return out;
  }, [answersF, sectionF]);

  // Promedios por bloque secciÃ³n F
  const blockAveragesF = useMemo(() => {
    const out = {};
    sectionF.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresF[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresF, sectionF]);

  // Porcentaje final secciÃ³n F
  const categoryPercentF = useMemo(() => {
    const groupAvgs = sectionF.blocks.map(b => blockAveragesF[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionF.finalFormulaDivisor);
  }, [blockAveragesF, sectionF]);
  // Handler de respuesta secciÃ³n F
  function handleAnswerChangeF(questionId, value) {
    setAnswersF(prev => ({ ...prev, [questionId]: value }));
  }

  // Mapeo de respuestas a score secciÃ³n A
  const scoresA = useMemo(() => {
    const out = {};
    sectionA.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers, sectionA]);

  // Mapeo de respuestas a score secciÃ³n B
  const scoresB = useMemo(() => {
    const out = {};
    sectionB.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers, sectionB]);

  // Mapeo de respuestas a score secciÃ³n C
  const scoresC = useMemo(() => {
    const out = {};
    sectionC.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers, sectionC]);

  // Mapeo de respuestas a score secciÃ³n D
  const scoresD = useMemo(() => {
    const out = {};
    sectionD.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers, sectionD]);

  // Mapeo de respuestas a score secciÃ³n E
  const scoresE = useMemo(() => {
    const out = {};
    sectionE.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = optionsE.find(opt => opt.value === answersE[q.id])?.score ?? null;
      });
    });
    return out;
  }, [answersE, optionsE, sectionE]);

  // Promedios por bloque secciÃ³n A
  const blockAveragesA = useMemo(() => {
    const out = {};
    sectionA.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresA[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresA, sectionA]);

  // Promedios por bloque secciÃ³n B
  const blockAveragesB = useMemo(() => {
    const out = {};
    sectionB.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresB[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresB, sectionB]);

  // Promedios por bloque secciÃ³n C
  const blockAveragesC = useMemo(() => {
    const out = {};
    sectionC.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresC[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresC, sectionC]);

  // Promedios por bloque secciÃ³n D
  const blockAveragesD = useMemo(() => {
    const out = {};
    sectionD.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresD[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresD, sectionD]);

  // Promedios por bloque secciÃ³n E
  const blockAveragesE = useMemo(() => {
    const out = {};
    sectionE.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresE[q.id]);
      const nums = vals.filter(v => typeof v === 'number' && v > 0);
      out[block.id] = nums.length === 0 ? null : nums.reduce((a, b) => a + b, 0) / nums.length;
    });
    return out;
  }, [scoresE, sectionE]);

  // Porcentaje final secciÃ³n A
  const categoryPercentA = useMemo(() => {
    const groupAvgs = sectionA.blocks.map(b => blockAveragesA[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionA.finalFormulaDivisor);
  }, [blockAveragesA, sectionA]);

  // Porcentaje final secciÃ³n B
  const categoryPercentB = useMemo(() => {
    const groupAvgs = sectionB.blocks.map(b => blockAveragesB[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionB.finalFormulaDivisor);
  }, [blockAveragesB, sectionB]);

  // Porcentaje final secciÃ³n C
  const categoryPercentC = useMemo(() => {
    const groupAvgs = sectionC.blocks.map(b => blockAveragesC[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionC.finalFormulaDivisor);
  }, [blockAveragesC, sectionC]);

  // Porcentaje final secciÃ³n D
  const categoryPercentD = useMemo(() => {
    const groupAvgs = sectionD.blocks.map(b => blockAveragesD[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionD.finalFormulaDivisor);
  }, [blockAveragesD, sectionD]);

  // Porcentaje final secciÃ³n E
  const categoryPercentE = useMemo(() => {
    const groupAvgs = sectionE.blocks.map(b => blockAveragesE[b.id] ?? 0);
    const sum = groupAvgs.reduce((a,b) => a + b, 0);
    const step1 = sum / sectionE.finalFormulaDivisor;
    const step2 = (step1 / 3) * 100;
    return step2;
  }, [blockAveragesE, sectionE]);

  // Handler de respuesta
  function handleAnswerChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  // Handler de respuesta secciÃ³n E
  function handleAnswerChangeE(questionId, value) {
    setAnswersE(prev => ({ ...prev, [questionId]: value }));
  }

  // Render pregunta
  const QuestionRow = React.memo(function QuestionRow({ question }) {
      const name = `${question.id}`;
      return (
        <div className={`autogestion-question-row${question.missing ? ' autogestion-question-missing' : ''}`}>
          <div className="autogestion-question-text">{question.text}</div>
          <div className="autogestion-question-options">
            {options.map(opt => (
              <label key={opt.value} className="autogestion-question-label" onClick={(e) => {
                e.preventDefault();
                handleAnswerChange(question.id, opt.value);
              }}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={answers[question.id] === opt.value}
                  onChange={() => {}}
                  className="autogestion-radio"
                />
                {opt.label} <span className="autogestion-question-score">({opt.score})</span>
              </label>
            ))}
          </div>
        </div>
      );
  });

  // Render pregunta secciÃ³n E
  const QuestionRowE = React.memo(function QuestionRowE({ question }) {
    return (
      <div className={`autogestion-question-row${question.missing ? ' autogestion-question-missing' : ''}`}>
        <div className="autogestion-question-text">{question.text}</div>
        <div className="autogestion-question-options">
          {optionsE.map(opt => (
            <label key={opt.value} className="autogestion-question-label" onClick={(e) => {
              e.preventDefault();
              handleAnswerChangeE(question.id, opt.value);
            }}>
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={answersE[question.id] === opt.value}
                onChange={() => {}}
                className="autogestion-radio"
              />
              {opt.label} <span className="autogestion-question-score">({opt.score})</span>
            </label>
          ))}
        </div>
      </div>
    );
  });

  // Render pregunta secciÃ³n F
  const QuestionRowF = React.memo(function QuestionRowF({ question }) {
    const name = `${question.id}`;
    return (
      <div className={`autogestion-question-row${question.missing ? ' autogestion-question-missing' : ''}`}>
        <div className="autogestion-question-text">{question.text}</div>
        <div className="autogestion-question-options">
          {options.map(opt => (
            <label key={opt.value} className="autogestion-question-label" onClick={(e) => {
              e.preventDefault();
              handleAnswerChangeF(question.id, opt.value);
            }}>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={answersF[question.id] === opt.value}
                onChange={() => {}}
                className="autogestion-radio"
              />
              {opt.label} <span className="autogestion-question-score">({opt.score})</span>
            </label>
          ))}
        </div>
      </div>
    );
  });

  // Render bloque
  function BlockGroup({ block, averages }) {
    return (
      <Card className="autogestion-block-card">
        <CardBody>
          <h4 className="autogestion-block-title">{block.title}</h4>
          {block.questions.map(q => (
            <QuestionRow key={q.id} question={{...q, missing: missingQuestions.includes(q.id)}} />
          ))}
          <div className="autogestion-block-average">
            {t('autogestion.form.blockAverage')} {averages[block.id] !== null ? averages[block.id].toFixed(2) : 'â€”'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render bloque secciÃ³n E
  function BlockGroupE({ block }) {
    return (
      <Card className="autogestion-block-card">
        <CardBody>
          <h4 className="autogestion-block-title autogestion-block-title-e">{block.title}</h4>
          {block.questions.map(q => (
            <QuestionRowE key={q.id} question={{...q, missing: missingQuestions.includes(q.id)}} />
          ))}
          <div className="autogestion-block-average autogestion-block-average-e">
            {t('autogestion.form.blockAverage')} {blockAveragesE[block.id] !== null ? blockAveragesE[block.id].toFixed(2) : 'â€”'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render bloque secciÃ³n F
  function BlockGroupF({ block }) {
    return (
      <Card className="autogestion-block-card">
        <CardBody>
          <h4 className="autogestion-block-title autogestion-block-title-f">{block.title}</h4>
          {block.questions.map(q => (
            <QuestionRowF key={q.id} question={{...q, missing: missingQuestions.includes(q.id)}} />
          ))}
          <div className="autogestion-block-average autogestion-block-average-f">
            {t('autogestion.form.blockAverage')} {blockAveragesF[block.id] !== null ? blockAveragesF[block.id].toFixed(2) : 'â€”'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen secciÃ³n A
  function SummaryPanelA() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#f1f8e9'}}>
        <CardBody>
          <h3 style={{color:'#2E7D32', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>{t('autogestion.form.summaries.economic')}</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionA.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesA[block.id] !== null ? blockAveragesA[block.id].toFixed(2) : t('autogestion.form.summaries.noAnswers')}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#217a3a', fontSize:'1.18rem'}}>
            {t('autogestion.form.summaries.finalPercentage')} {t('autogestion.form.sections.economicDiagnosis').toLowerCase()}: {isNaN(categoryPercentA) ? 'â€”' : categoryPercentA.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen secciÃ³n B
  function SummaryPanelB() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#e3f2fd'}}>
        <CardBody>
          <h3 style={{color:'#1565c0', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>{t('autogestion.form.summaries.environmental')}</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionB.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesB[block.id] !== null ? blockAveragesB[block.id].toFixed(2) : t('autogestion.form.summaries.noAnswers')}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#1565c0', fontSize:'1.18rem'}}>
            {t('autogestion.form.summaries.finalPercentage')} {t('autogestion.form.sections.environmentalManagement').toLowerCase()}: {isNaN(categoryPercentB) ? 'â€”' : categoryPercentB.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen secciÃ³n C
  function SummaryPanelC() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#e8f5e9'}}>
        <CardBody>
          <h3 style={{color:'#2e7d32', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>{t('autogestion.form.summaries.energy')}</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionC.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesC[block.id] !== null ? blockAveragesC[block.id].toFixed(2) : t('autogestion.form.summaries.noAnswers')}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#2e7d32', fontSize:'1.18rem'}}>
            {t('autogestion.form.summaries.finalPercentage')} {t('autogestion.form.sections.energyManagement').toLowerCase()}: {isNaN(categoryPercentC) ? 'â€”' : categoryPercentC.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen secciÃ³n D
  function SummaryPanelD() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#f3e5f5'}}>
        <CardBody>
          <h3 style={{color:'#6a1b9a', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>{t('autogestion.form.summaries.occupationalSafety')}</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionD.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesD[block.id] !== null ? blockAveragesD[block.id].toFixed(2) : t('autogestion.form.summaries.noAnswers')}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#6a1b9a', fontSize:'1.18rem'}}>
            {t('autogestion.form.summaries.finalPercentage')} {t('autogestion.form.sections.occupationalSafety').toLowerCase()}: {isNaN(categoryPercentD) ? 'â€”' : categoryPercentD.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen secciÃ³n E
  function SummaryPanelE() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(21,101,192,0.10)', background:'#e3f2fd'}}>
        <CardBody>
          <h3 style={{color:'#1565c0', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>{t('autogestion.form.summaries.social')}</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionE.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesE[block.id] !== null ? blockAveragesE[block.id].toFixed(2) : t('autogestion.form.summaries.noAnswers')}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#1565c0', fontSize:'1.18rem'}}>
            {t('autogestion.form.summaries.finalPercentage')} {t('autogestion.form.sections.socialDiagnosis').toLowerCase()}: {isNaN(categoryPercentE) ? 'â€”' : categoryPercentE.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen secciÃ³n F
  function SummaryPanelF() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(21,101,192,0.10)', background:'#f9fbe7'}}>
        <CardBody>
          <h3 style={{color:'#c0a115', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>{t('autogestion.form.summaries.warehouse')}</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionF.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesF[block.id] !== null ? blockAveragesF[block.id].toFixed(2) : t('autogestion.form.summaries.noAnswers')}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#c0a115', fontSize:'1.18rem'}}>
            {t('autogestion.form.summaries.finalPercentage')} {t('autogestion.form.sections.warehouseDiagnosis').toLowerCase()}: {isNaN(categoryPercentF) ? 'â€”' : categoryPercentF.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // NavegaciÃ³n wizard - Simplificada y mejorada
  function handleNextStep() {
    // Validar que todas las preguntas del paso actual estÃ©n respondidas
    let missing = [];
    if (currentStep === 0) {
      sectionA.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 1) {
      sectionB.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 2) {
      sectionC.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 3) {
      sectionD.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 4) {
      sectionE.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answersE[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 5) {
      sectionF.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answersF[q.id]) missing.push(q.id);
        });
      });
    }
    setMissingQuestions(missing);
    if (missing.length > 0) {
      setStepError(t('autogestion.form.validation.answerAllQuestions'));
      setShowErrorModal(true);
      return;
    }
    setStepError("");
    setShowErrorModal(false);
    setMissingQuestions([]);
    if (currentStep < sectionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }
  
  function handlePrevStep() {
    setStepError("");
    setMissingQuestions([]);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }
  
  function handleStartWizard() {
    // Si no ha aceptado el consentimiento, mostrar el modal de polÃ­ticas
    if (!consentimientoAceptado) {
      setShowModalPoliticas(true);
      return;
    }
    // Si ya aceptÃ³, proceder con la validaciÃ³n normal
    handleStartWizardInternal();
  }

  function handleStartWizardInternal() {
    // Validar datos de empresa
    const camposObligatorios = [
      { campo: 'nombreEmpresa', nombre: t('autogestion.form.fields.companyName') },
      { campo: 'nit', nombre: t('autogestion.form.fields.nit') },
      { campo: 'correo', nombre: t('autogestion.form.fields.email') }
    ];
    
    const camposFaltantes = camposObligatorios.filter(item => 
      !datosEmpresa[item.campo] || datosEmpresa[item.campo].trim() === ''
    );
    
    if (camposFaltantes.length > 0) {
      const nombresCampos = camposFaltantes.map(item => item.nombre).join(', ');
      setStepError(t('autogestion.form.validation.missingFields', { fields: nombresCampos }));
      setShowErrorModal(true);
      return;
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datosEmpresa.correo)) {
      setStepError(t('autogestion.form.validation.invalidEmail'));
      setShowErrorModal(true);
      return;
    }
    
    setStepError("");
    setShowErrorModal(false);
    setMissingQuestions([]);
    setShowWizard(true);
    setCurrentStep(0);
  }

  const handleAceptarPoliticas = () => {
    setConsentimientoAceptado(true);
    setShowModalPoliticas(false);
    // Proceder con la validaciÃ³n y apertura del wizard
    handleStartWizardInternal();
  };

  const handleCancelarPoliticas = () => {
    setShowModalPoliticas(false);
  };
  
  function handleCloseWizard() {
    setStepError("");
    setMissingQuestions([]);
    setShowWizard(false);
    setCurrentStep(0);
  }

  // FunciÃ³n para descargar PDF
  async function handleDescargarPDF() {
    try {
      if (window.confirm(t('autogestion.form.actions.confirmDownload'))) {
        const datosCompletos = prepararDatosCompletos();
        
        const response = await fetch('/api/generar-pdf-autogestion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosCompletos)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Error al generar PDF: ' + errorText);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Autodiagnostico_' + (datosEmpresa.nombreEmpresa || 'Empresa').replace(/\s+/g, '_') + '.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert(t('autogestion.form.actions.downloadSuccess'));
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert(t('autogestion.form.actions.downloadError') + '\n\nDetalle: ' + error.message);
    }
  }

  // FunciÃ³n para enviar por email
  async function handleEnviarEmail() {
    try {
      if (!datosEmpresa.correo) {
        alert(t('autogestion.form.validation.invalidEmail'));
        return;
      }
      
      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(datosEmpresa.correo)) {
        alert(t('autogestion.form.validation.invalidEmail'));
        return;
      }
      
      if (window.confirm(t('autogestion.form.actions.confirmEmail', { email: datosEmpresa.correo }))) {
        const datosCompletos = prepararDatosCompletos();
        
        const EmailService = require('../../services/EmailService').default;
        await EmailService.sendAutogestionByEmail(datosCompletos);
        
        alert(t('autogestion.form.actions.emailSuccess', { email: datosEmpresa.correo }));
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      alert(t('autogestion.form.actions.emailError') + '\n\nDetalle: ' + error.message);
    }
  }

  // FunciÃ³n auxiliar para preparar datos completos
  function prepararDatosCompletos() {
    return {
      datosEmpresa: datosEmpresa,
      respuestas: {
        seccionA: Object.keys(answers).filter(k => k.startsWith('A_')).reduce((obj, k) => ({ ...obj, [k]: answers[k] }), {}),
        seccionB: Object.keys(answers).filter(k => k.startsWith('B_')).reduce((obj, k) => ({ ...obj, [k]: answers[k] }), {}),
        seccionC: Object.keys(answers).filter(k => k.startsWith('C_')).reduce((obj, k) => ({ ...obj, [k]: answers[k] }), {}),
        seccionD: Object.keys(answers).filter(k => k.startsWith('D_')).reduce((obj, k) => ({ ...obj, [k]: answers[k] }), {}),
        seccionE: answersE,
        seccionF: answersF
      },
      promedios: {
        A: { bloques: blockAveragesA, porcentajeFinal: categoryPercentA },
        B: { bloques: blockAveragesB, porcentajeFinal: categoryPercentB },
        C: { bloques: blockAveragesC, porcentajeFinal: categoryPercentC },
        D: { bloques: blockAveragesD, porcentajeFinal: categoryPercentD },
        E: { bloques: blockAveragesE, porcentajeFinal: categoryPercentE },
        F: { bloques: blockAveragesF, porcentajeFinal: categoryPercentF }
      },
      esquemas: {
        seccionA: sectionA,
        seccionB: sectionB,
        seccionC: sectionC,
        seccionD: sectionD,
        seccionE: sectionE,
        seccionF: sectionF
      },
      opciones: {
        standard: options,
        seccionE: optionsE
      },
      fecha: new Date().toLocaleDateString('es-CO')
    };
  }

  // FunciÃ³n para guardar en base de datos
  async function handleMostrarResumen() {
    try {
      if (!datosEmpresa.nombreEmpresa || !datosEmpresa.nit) {
        alert('âš ï¸ Nombre de empresa y NIT son obligatorios para guardar');
        return;
      }

      setGuardandoDatos(true);

      const datosCompletos = prepararDatosCompletos();
      const datosParaGuardar = {
        datosEmpresa: datosEmpresa,
        respuestas: datosCompletos.respuestas, // Todas las respuestas estructuradas
        porcentajeA: categoryPercentA,
        porcentajeB: categoryPercentB,
        porcentajeC: categoryPercentC,
        porcentajeD: categoryPercentD,
        porcentajeE: categoryPercentE,
        porcentajeF: categoryPercentF,
        porcentajeFinal: Math.round(((categoryPercentA + categoryPercentB + categoryPercentC + categoryPercentD + categoryPercentE + categoryPercentF) / 6) * 100) / 100
      };

      console.log('ðŸ“¤ Enviando datos de autogestiÃ³n:', datosParaGuardar);

      const response = await fetch('/api/autogestion/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaGuardar)
      });

      const result = await response.json();

      if (result.success) {
        setCodigoSeguimiento(result.codigo);
        setDatosGuardados(true);
        
        // Mostrar resumen completo
        const resumen = `
ðŸŽ‰ AUTODIAGNÃ“STICO GUARDADO EXITOSAMENTE

ï¿½ RESUMEN DE DATOS:
ðŸ†” ID en Base de Datos: ${result.id}
ï¿½ CÃ³digo de Seguimiento: ${result.codigo}
ðŸ¢ Empresa: ${result.datosEmpresa.nombreEmpresa}
ðŸ“„ NIT: ${result.datosEmpresa.nit}

ï¿½ RESULTADOS:
â€¢ Porcentaje Final: ${result.porcentajeFinal}%
â€¢ Nivel de Cumplimiento: ${result.nivelCumplimiento}
â€¢ Respuestas Guardadas: ${result.respuestasGuardadas}

âœ… ${result.mensaje}
        `;
        
        alert(resumen);
        
      } else {
        throw new Error(result.error || 'Error desconocido al guardar');
      }

    } catch (error) {
      console.error('âŒ Error guardando autogestiÃ³n:', error);
      alert(`âŒ Error al guardar en base de datos\n\nDetalle: ${error.message}`);
    } finally {
      setGuardandoDatos(false);
    }
  }

  return (
  <>
      {/* Modal de error emergente */}
      {showErrorModal && (
        <div className="autogestion-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div className="autogestion-modal" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <div className="autogestion-modal-header" style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#d32f2f',
              marginBottom: '16px',
              textAlign: 'center'
            }}>âš ï¸ {t('autogestion.form.validation.error')}</div>
            <div className="autogestion-modal-body" style={{
              fontSize: '1.1rem',
              color: '#333',
              marginBottom: '24px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>{stepError}</div>
            <div className="autogestion-modal-footer" style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button 
                color="danger" 
                onClick={() => setShowErrorModal(false)} 
                style={{
                  fontWeight: 700, 
                  borderRadius: 10,
                  padding: '12px 32px',
                  fontSize: '1.1rem'
                }}
              >{t('autogestion.form.validation.close')}</Button>
            </div>
          </div>
        </div>
      )}
      {/* Formulario de datos de empresa al inicio */}
      {!showWizard && (
        noCard ? (
          <div style={{maxWidth:600, margin:'0 auto', padding:'0 28px 32px 28px', background:'transparent'}}>
            <h2 style={{fontWeight:900, fontSize:'1.35rem', marginBottom:24, color:'#388e3c', textAlign:'center', marginTop:0, paddingTop:0}}>{t('autogestion.form.companyData')}</h2>
            <form>
              <div style={{display:'flex', flexWrap:'wrap', gap:'18px'}}>
                <input name="nombreEmpresa" value={datosEmpresa.nombreEmpresa} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.companyName')} className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                <input name="nit" value={datosEmpresa.nit} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.nit')} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="direccion" value={datosEmpresa.direccion} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.address')} className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                {/* Select de departamento */}
                <select name="departamento" value={datosEmpresa.departamento} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}}>
                  <option value="">{t('autogestion.form.fields.department')}</option>
                  {departamentos.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {/* Select de municipio dependiente del departamento */}
                <select name="municipio" value={datosEmpresa.municipio} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} disabled={!datosEmpresa.departamento}>
                  <option value="">{t('autogestion.form.fields.municipality')}</option>
                  {municipiosFiltrados.map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
                <input name="aÃ±oBase" value={datosEmpresa.aÃ±oBase} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.baseYear')} className="form-control" style={{flex:'1 1 80px', marginBottom:10}} />
                <input name="fechaReporte" value={datosEmpresa.fechaReporte} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.reportDate')} type="date" className="form-control" style={{flex:'1 1 140px', marginBottom:10}} />
                <input name="telefono" value={datosEmpresa.telefono} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.phone')} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="correo" value={datosEmpresa.correo} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.email')} className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="personaElabora" value={datosEmpresa.personaElabora} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.preparedBy')} className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="cargo" value={datosEmpresa.cargo} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.position')} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
              </div>
            </form>
            <div style={{textAlign:'center', marginTop:32}}>
              <Button color="success" size="lg" style={{fontWeight:900, fontSize:'1.2rem', padding:'18px 44px', borderRadius:16}} onClick={handleStartWizard}>
                {t('autogestion.form.startDiagnosis')}
              </Button>
            </div>
          </div>
        ) : (
          <div style={{maxWidth:600, margin:'0 auto', background:'#fff', borderRadius:18, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', padding:'0 28px 32px 28px'}}>
            <h2 style={{fontWeight:900, fontSize:'1.35rem', marginBottom:24, color:'#388e3c', textAlign:'center', marginTop:0}}>{t('autogestion.form.companyData')}</h2>
            <form>
              <div style={{display:'flex', flexWrap:'wrap', gap:'18px'}}>
                <input name="nombreEmpresa" value={datosEmpresa.nombreEmpresa} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.companyName')} className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                <input name="nit" value={datosEmpresa.nit} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.nit')} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="direccion" value={datosEmpresa.direccion} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.address')} className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                {/* Select de departamento */}
                <select name="departamento" value={datosEmpresa.departamento} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}}>
                  <option value="">{t('autogestion.form.fields.department')}</option>
                  {departamentos.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {/* Select de municipio dependiente del departamento */}
                <select name="municipio" value={datosEmpresa.municipio} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} disabled={!datosEmpresa.departamento}>
                  <option value="">{t('autogestion.form.fields.municipality')}</option>
                  {municipiosFiltrados.map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
                <input name="aÃ±oBase" value={datosEmpresa.aÃ±oBase} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.baseYear')} className="form-control" style={{flex:'1 1 80px', marginBottom:10}} />
                <input name="fechaReporte" value={datosEmpresa.fechaReporte} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.reportDate')} type="date" className="form-control" style={{flex:'1 1 140px', marginBottom:10}} />
                <input name="telefono" value={datosEmpresa.telefono} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.phone')} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="correo" value={datosEmpresa.correo} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.email')} className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="personaElabora" value={datosEmpresa.personaElabora} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.preparedBy')} className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="cargo" value={datosEmpresa.cargo} onChange={handleEmpresaChange} placeholder={t('autogestion.form.fields.position')} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
              </div>
            </form>
            <div style={{textAlign:'center', marginTop:32}}>
              <Button color="success" size="lg" style={{fontWeight:900, fontSize:'1.2rem', padding:'18px 44px', borderRadius:16}} onClick={handleStartWizard}>
                {t('autogestion.form.startDiagnosis')}
              </Button>
            </div>
          </div>
        )
      )}
      {/* Wizard pantalla completa - REDISEÃ‘ADO PARA EVITAR SOBREPOSICIÃ“N */}
      {showWizard && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100vw',
          height:'100vh',
          background: sectionSteps[currentStep].gradient,
          zIndex:9999,
          overflowY:'auto',
          paddingTop: '20px',
          paddingBottom: '20px',
          transition:'background 0.5s',
          scrollBehavior: 'auto',
        }}>
          <div style={{
            width:'100%',
            maxWidth:900,
            margin:'0 auto',
          }}>
            {/* Barra de progreso y cabecera - NO STICKY para evitar ocultamiento */}
            <div style={{
              width:'100%',
              display:'flex', 
              alignItems:'center', 
              justifyContent:'space-between',
              background:'rgba(241,248,233,0.95)',
              borderRadius:18,
              boxShadow:'0 2px 12px 0 rgba(46,125,50,0.08)',
              padding:'18px 32px',
              marginBottom: '20px'
            }}>
              <div style={{fontWeight:900, fontSize:'1.15rem', color:'#388e3c'}}>
                {t('autogestion.form.navigation.step')} {currentStep+1} {t('autogestion.form.navigation.of')} {sectionSteps.length}: <span style={{color:'#1565c0'}}>{sectionSteps[currentStep].label}</span>
              </div>
              <Button color="danger" outline onClick={handleCloseWizard} style={{fontWeight:700, fontSize:'1rem', borderRadius:12, padding:'8px 24px'}}>{t('autogestion.form.navigation.exit')}</Button>
            </div>

            {/* Contenido del paso - SIN PADDING EXTRA QUE CAUSE PROBLEMAS */}
            <div style={{
              width:'100%',
              background:'white',
              borderRadius:24,
              boxShadow:'0 4px 32px 0 rgba(46,125,50,0.13)',
              padding:'30px 32px',
              position:'relative',
              display:'flex',
              flexDirection:'column',
              justifyContent:'flex-start',
            }}>
              {stepError && (
                <div className="autogestion-step-error" style={{
                  background:'#ffeaea',
                  color:'#c62828',
                  fontWeight:'bold',
                  borderRadius:'8px',
                  padding:'12px',
                  marginBottom:'18px',
                  textAlign:'center',
                  boxShadow:'0 2px 8px 0 rgba(198,40,40,0.08)'
                }}>
                  {stepError}
                </div>
              )}
              {currentStep === 0 && (
                <>
                  <h2 style={{ color: '#2E7D32', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>{t('autogestion.form.sections.economicDiagnosis')}</h2>
                  {sectionA.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesA} />
                  ))}
                  <SummaryPanelA />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" disabled={currentStep === 0} onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.previous')}</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.next')}</Button>
                  </div>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <h2 style={{ color: '#1565c0', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>{t('autogestion.form.sections.environmentalManagement')}</h2>
                  {sectionB.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesB} />
                  ))}
                  <SummaryPanelB />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.previous')}</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.next')}</Button>
                  </div>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h2 style={{ color: '#2e7d32', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>
                    {t('autogestion.form.sections.energyManagement')}
                  </h2>
                  {sectionC.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesC} />
                  ))}
                  <SummaryPanelC />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.previous')}</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.next')}</Button>
                  </div>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 style={{ color: '#6a1b9a', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>
                    {t('autogestion.form.sections.occupationalSafety')}
                  </h2>
                  {sectionD.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesD} />
                  ))}
                  <SummaryPanelD />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.previous')}</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.next')}</Button>
                  </div>
                </>
              )}
              {currentStep === 4 && (
                <>
                  <h2 style={{ color: '#1565c0', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>
                    {t('autogestion.form.sections.socialDiagnosis')}
                  </h2>
                  {sectionE.blocks.map(block => (
                    <BlockGroupE key={block.id} block={block} />
                  ))}
                  <SummaryPanelE />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.previous')}</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>{t('autogestion.form.navigation.next')}</Button>
                  </div>
                </>
              )}
              {currentStep === 5 && (
                <>
                  <h2 style={{ color: '#c0a115', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>
                    {t('autogestion.form.sections.warehouseDiagnosis')}
                  </h2>
                  {sectionF.blocks.map(block => (
                    <BlockGroupF key={block.id} block={block} />
                  ))}
                  <SummaryPanelF />
                  
                  {/* BOTÃ“N PRINCIPAL: Calcular y Guardar Resumen */}
                  <div style={{width:'100%', display:'flex', justifyContent:'center', marginTop:32}}>
                    <button
                      style={{
                        fontWeight: 800,
                        fontSize: 20,
                        borderRadius: 28,
                        padding: '16px 48px',
                        background: guardandoDatos 
                          ? 'linear-gradient(90deg, #9E9E9E 0%, #757575 100%)'
                          : 'linear-gradient(90deg, #FF9800 0%, #F57C00 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: guardandoDatos ? '0 4px 20px #bdbdbd' : '0 4px 20px #ffcc80',
                        transition: 'all 0.3s ease',
                        cursor: guardandoDatos ? 'not-allowed' : 'pointer',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}
                      onClick={handleMostrarResumen}
                      disabled={guardandoDatos}
                    >
                      {guardandoDatos ? 'â³ Guardando Datos...' : 'ðŸ“Š Calcular y Guardar Resumen'}
                    </button>
                  </div>

                  {/* MOSTRAR RESULTADOS SOLO DESPUÃ‰S DE GUARDAR */}
                  {datosGuardados && codigoSeguimiento && (
                    <>
                      {/* Mostrar cÃ³digo de seguimiento */}
                      <div style={{
                        maxWidth: 600,
                        margin: '32px auto',
                        padding: '24px 32px',
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        border: '3px solid #2196F3',
                        borderRadius: 20,
                        textAlign: 'center',
                        boxShadow: '0 8px 32px rgba(33, 150, 243, 0.25)'
                      }}>
                        <h3 style={{
                          color: '#1976D2',
                          fontWeight: 900,
                          fontSize: '1.5rem',
                          marginBottom: 16,
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          âœ… AutodiagnÃ³stico Completado
                        </h3>
                        <div style={{
                          background: '#fff',
                          padding: '20px 24px',
                          borderRadius: 16,
                          marginBottom: 20,
                          border: '2px solid #e3f2fd'
                        }}>
                          <p style={{
                            color: '#424242',
                            fontWeight: 600,
                            marginBottom: 12,
                            fontSize: '1.1rem'
                          }}>
                            CÃ³digo de seguimiento:
                          </p>
                          <p style={{
                            color: '#1976D2',
                            fontWeight: 900,
                            fontSize: '2rem',
                            margin: 0,
                            fontFamily: 'monospace',
                            letterSpacing: '3px'
                          }}>
                            {codigoSeguimiento}
                          </p>
                        </div>
                        <p style={{
                          color: '#546e7a',
                          fontSize: '1rem',
                          margin: 0,
                          lineHeight: 1.6
                        }}>
                          ðŸ’¡ Conserve este cÃ³digo para consultar su autodiagnÃ³stico en el futuro
                        </p>
                      </div>

                      {/* Mostrar datos de empresa */}
                      <div style={{maxWidth:700, margin:'24px auto 0 auto', background:'#fff', borderRadius:18, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', padding:'32px 28px'}}>
                        <h3 style={{fontWeight:900, fontSize:'1.25rem', marginBottom:18, color:'#388e3c'}}>{t('autogestion.form.companyData')}</h3>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'18px'}}>
                          <div style={{flex:'1 1 220px', marginBottom:10}}><b>Nombre:</b> {datosEmpresa.nombreEmpresa}</div>
                          <div style={{flex:'1 1 120px', marginBottom:10}}><b>NIT:</b> {datosEmpresa.nit}</div>
                          <div style={{flex:'1 1 220px', marginBottom:10}}><b>DirecciÃ³n:</b> {datosEmpresa.direccion}</div>
                          <div style={{flex:'1 1 120px', marginBottom:10}}><b>Departamento:</b> {datosEmpresa.departamento}</div>
                          <div style={{flex:'1 1 120px', marginBottom:10}}><b>Municipio:</b> {datosEmpresa.municipio}</div>
                          <div style={{flex:'1 1 80px', marginBottom:10}}><b>AÃ±o base:</b> {datosEmpresa.aÃ±oBase}</div>
                          <div style={{flex:'1 1 140px', marginBottom:10}}><b>Fecha de reporte:</b> {datosEmpresa.fechaReporte}</div>
                          <div style={{flex:'1 1 120px', marginBottom:10}}><b>TelÃ©fono:</b> {datosEmpresa.telefono}</div>
                          <div style={{flex:'1 1 180px', marginBottom:10}}><b>Correo:</b> {datosEmpresa.correo}</div>
                          <div style={{flex:'1 1 180px', marginBottom:10}}><b>Persona que elabora:</b> {datosEmpresa.personaElabora}</div>
                          <div style={{flex:'1 1 120px', marginBottom:10}}><b>Cargo:</b> {datosEmpresa.cargo}</div>
                        </div>
                      </div>

                      {/* Mostrar resumen global */}
                      <ResumenGlobal
                        porcentajes={{
                          A: categoryPercentA,
                          B: categoryPercentB,
                          C: categoryPercentC,
                          D: categoryPercentD,
                          E: categoryPercentE,
                          F: categoryPercentF
                        }}
                      />

                      {/* Botones de descarga y envÃ­o - SOLO DESPUÃ‰S DE GUARDAR */}
                      <div style={{width:'100%', display:'flex', justifyContent:'center', gap:24, marginTop:32, flexWrap:'wrap'}}>
                        <button
                          className="btn-download-green"
                          style={{
                            fontWeight: 800,
                            fontSize: 17,
                            borderRadius: 24,
                            padding: '12px 36px',
                            background: 'linear-gradient(90deg, #43a047 0%, #388e3c 100%)',
                            color: '#fff',
                            border: 'none',
                            boxShadow: '0 2px 12px #b7e4c7',
                            transition: 'background 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}
                          onClick={handleDescargarPDF}
                        >
                          ðŸ“¥ {t('autogestion.form.actions.downloadPDF') || 'Descargar PDF'}
                        </button>
                        <button
                          className="btn-email-green"
                          style={{
                            fontWeight: 800,
                            fontSize: 17,
                            borderRadius: 24,
                            padding: '12px 36px',
                            background: 'linear-gradient(90deg, #2196F3 0%, #1976D2 100%)',
                            color: '#fff',
                            border: 'none',
                            boxShadow: '0 2px 12px #90caf9',
                            transition: 'background 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}
                          onClick={handleEnviarEmail}
                        >
                          ðŸ“§ {t('autogestion.form.actions.sendByEmail') || 'Enviar por Email'}
                        </button>
                      </div>
                    </>
                  )}
