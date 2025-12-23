import { useState, useMemo } from 'react';
import type { SeasonScore, Student } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SeasonTableProps = {
  scores: SeasonScore[];
  students: Map<string, Student>;
  viewMode: 'raw' | 'final';
};

type SortField = 'student_id' | 'total_final';
type SortDirection = 'asc' | 'desc';

export default function SeasonTable({
  scores,
  students,
  viewMode,
}: SeasonTableProps) {
  // 預設按總分降序排列
  const [sortField, setSortField] = useState<SortField>('total_final');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // 處理排序切換
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 同一欄位：切換方向
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 不同欄位：切換欄位，設定預設方向
      setSortField(field);
      setSortDirection(field === 'student_id' ? 'asc' : 'desc');
    }
  };

  // 排序後的資料
  const sortedScores = useMemo(() => {
    return [...scores].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'student_id') {
        comparison = a.student_id.localeCompare(b.student_id);
      } else {
        comparison = a.total_final - b.total_final;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [scores, sortField, sortDirection]);

  // 取得排序圖示
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="ml-1 h-4 w-4" />
      : <ArrowDown className="ml-1 h-4 w-4" />;
  };

  if (scores.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        尚無學期成績資料
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 text-center">名次</TableHead>
            <TableHead className="w-32">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 hover:bg-transparent"
                onClick={() => handleSort('student_id')}
              >
                學號
                {getSortIcon('student_id')}
              </Button>
            </TableHead>
            <TableHead>暱稱</TableHead>
            {viewMode === 'raw' ? (
              <>
                <TableHead className="text-right">週數</TableHead>
                <TableHead className="text-right">平均原始分數</TableHead>
              </>
            ) : (
              <>
                <TableHead className="text-right">最佳週數</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 hover:bg-transparent font-semibold"
                    onClick={() => handleSort('total_final')}
                  >
                    學期總分
                    {getSortIcon('total_final')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">百分制</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedScores.map((score) => {
            const student = students.get(score.student_id);
            const displayName = student?.display_name || score.student_id;

            // 計算原始分數平均（用於 Raw 模式）
            const totalRawScore = score.weekly.reduce((sum, w) => sum + w.raw_score, 0);
            const avgRawScore = score.weekly.length > 0
              ? totalRawScore / score.weekly.length
              : 0;

            return (
              <TableRow key={score.student_id}>
                <TableCell className="text-center font-medium">
                  {score.rank}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {score.student_id}
                </TableCell>
                <TableCell>{displayName}</TableCell>
                {viewMode === 'raw' ? (
                  <>
                    <TableCell className="text-right">
                      {score.weekly.length}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {avgRawScore.toFixed(2)}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="text-right">
                      {Math.min(score.best_n, score.weekly.length)} / {score.best_n}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {score.total_final.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {score.percent_100.toFixed(2)}
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
