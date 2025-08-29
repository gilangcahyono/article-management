import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "@/lib/axios";
import { formatedDate } from "@/lib/utils";
import { Category } from "@/types/articles";
import Actions from "./Actions";
import Toolbar from "./Toolbar";

interface Params {
  searchParams: Promise<{ search: string; page: string }>;
}

const Page: React.FC<Params> = async ({ searchParams }) => {
  const search = (await searchParams).search;
  const page = (await searchParams).page;

  const res = await axios.get("/categories", {
    params: {
      page: page || 1,
      limit: 50,
    },
  });
  let data = res.data.data;
  if (search) {
    data = res.data.data.filter((category: Category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const categories: Category[] = data;

  return (
    <div className="p-5 border bg-white rounded-lg">
      <h2 className="text-md font-semibold pb-5 mb-5 border-b">
        Total Category : {categories.length}
      </h2>

      <Toolbar />

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: Category, i: number) => (
            <TableRow key={i}>
              <TableCell className="py-5">{category.name}</TableCell>
              <TableCell>{formatedDate(category.createdAt)}</TableCell>
              <TableCell>
                <Actions category={category} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
