import * as SearchService from '../services/search.js';
import { response } from '../services/utils.js';

const SearchEvent = async (req, res) => {
    try {
        const { mixed, page = 1, pageSize = 10, searchType = "venue" } = req.query;

        if (!mixed) {
            return res.status(400).json(response("failed", "Invalid mixed param"));
        }

        if (searchType === "user") {
            const result = await SearchService.SearchUsers(mixed, page, pageSize);
            return res.status(200).json(response("success", "Search successful", "users", result.users, result.currentPage, result.maxPageSize, result.pageSize, result.totalUsers));
        } else if (searchType === "venue") {
            const result = await SearchService.SearchVenues(mixed, page, pageSize);
            return res.status(200).json(response("success", "Search successful", "venues", result.venues, result.currentPage, result.maxPageSize, result.pageSize, result.totalVenues));
        } else {
            return res.status(400).json(response("failed", "Invalid search type"));
        }
    } catch (error) {
        return res.status(500).json(response('error', error.message));
    }
};

export { SearchEvent };
