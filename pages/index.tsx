// @/pages/index.tsx
import { GetStaticProps, GetStaticPropsContext } from 'next';
import '@/public/assets/css/styles.css';
import StaffMembers from '../components/interface/members';
import staffData from '@/data/Members.json';
import { Staff, Member } from '@/types/index';
import { validateStaffImages } from './api/validateImages';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import fs from 'fs';
import path from 'path';

// Function to ensure userID is a number
const parseMembers = (data: any): Staff => {
  const parseMember = (member: any): Member => ({
    ...member,
    userID: typeof member.userID === 'string' ? parseInt(member.userID, 10) : member.userID,
  });

  return {
    developer: data.developer.map(parseMember),
    communityManager: data.communityManager.map(parseMember),
    toaster: data.toaster.map(parseMember),
    moderator: data.moderator.map(parseMember),
    member: data.member.map(parseMember),
  };
};

const Home = () => {
  const { t } = useTranslation('common');
  const staff: Staff = parseMembers(staffData[0]);
  
  return (
    <>
      <StaffMembers staff={staff} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const filePath = path.resolve(process.cwd(), 'data/Members.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  let staff: Staff = JSON.parse(jsonData)[0];
  staff = await validateStaffImages(staff);
  return {
    props: {
      staff,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default Home;