import type { ChangeEvent, FC } from 'react';
import { ReceiptControllerService } from '../../lib/openapi';

const ExpensesScanRoute: FC = () => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length !== 1) return;
    var file = event.target.files[0];
    ReceiptControllerService.scanReceipt({ file }).then(console.log);
  };

  return (
    <div>
      <input type="file" onChange={onChange} />
    </div>
  );
};
export default ExpensesScanRoute;
