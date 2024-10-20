import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ElevatorSimulator from './App/Elevator/page';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ElevatorSimulator />
    </QueryClientProvider>
);

export default App;
