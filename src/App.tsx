/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Game } from './components/Game';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl mb-4 font-bold">BrowserStardew Prototype</h1>
      <Game />
    </div>
  );
}
