
import { Card, CardContent } from './ui/card'
import { Badge } from "@/components/ui/badge"
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RouteBlogDetails } from '@/helper/RouteName';

const BlogCard = ({ props }) => {
    const user = useSelector((state) => state.user);
    return (
        <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
        <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={props?.author?.avatar || ''} alt={props?.author?.name || 'User'} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
                                {props?.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-800 text-sm">{props?.author?.name || 'Unknown'}</span>
                    </div>
                    {props?.author?.role === 'admin' && (
                        <Badge variant="outline" className="bg-blue-500 text-white text-xs">Admin</Badge>
                    )}
                </div>
                <div className="mb-3 h-48 overflow-hidden rounded-lg">
                   <img src={props.featuredImage} className="w-full h-full object-cover" alt={props?.title || 'Blog image'} />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                    <FaRegCalendarAlt />
                    <span>{moment(props?.createdAt).format('YYYY-MM-DD')}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{props?.title || 'Blog Title'}</h2>
            </CardContent>
        </Card>
        </Link>
    );
};

export default BlogCard;
