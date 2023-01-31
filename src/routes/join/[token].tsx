import { FC, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SessionContext } from '../../context/sessionContext';

const JoinTokenRoute: FC = () => {
  const { token } = useParams();
  const { setGroupId, setUserId } = useContext(SessionContext);

  if (!token) return <p>Loading...</p>;

  return <main></main>;
};
export default JoinTokenRoute;
