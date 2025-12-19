import { MemberProfile } from '@/components/cms/members/MemberProfile';

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  return <MemberProfile memberId={params.id} />;
}
