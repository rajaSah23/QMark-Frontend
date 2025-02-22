import QuestionList from './QuestionList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout';


export const Questions = () => {
    return (
        <Layout>
               <QuestionList />
        </Layout>
    )
};
