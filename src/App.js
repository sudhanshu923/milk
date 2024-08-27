import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [milk, setMilk] = useState('');
  const [milkData, setMilkData] = useState({});
  const pricePerLitre = 70;

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMilkChange = (e) => {
    setMilk(e.target.value);
  };

  const handleAddMilk = () => {
    const dateKey = selectedDate.toLocaleDateString();
    const currentMilk = milkData[dateKey] || 0;
    const updatedMilkData = {
      ...milkData,
      [dateKey]: currentMilk + parseFloat(milk),
    };
    setMilkData(updatedMilkData);
    setMilk('');
  };

  const calculateTotalMilk = () => {
    return Object.values(milkData).reduce((acc, current) => acc + current, 0);
  };

  const calculateTotalPrice = () => {
    return calculateTotalMilk() * pricePerLitre;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Milk Collection Report', 20, 10);
    doc.autoTable({
      head: [['Date', 'Litres Collected']],
      body: Object.keys(milkData).map((date) => [date, milkData[date].toString()]),
    });
    doc.text(`Total Milk: ${calculateTotalMilk()} litres`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Price: ₹${calculateTotalPrice()}`, 14, doc.autoTable.previous.finalY + 20);
    doc.save('milk_report.pdf');
  };

  return (
    <div className="App">
      <h1>Milk Tracker</h1>
      <div>
        <DatePicker selected={selectedDate} onChange={handleDateChange} />
        <input
          type="number"
          value={milk}
          onChange={handleMilkChange}
          placeholder="Enter litres of milk"
        />
        <button onClick={handleAddMilk}>Add Milk</button>
      </div>
      <h2>Daily Milk Collection:</h2>
      <ul>
        {Object.keys(milkData).map((date) => (
          <li key={date}>
            {date}: {milkData[date]} litres
          </li>
        ))}
      </ul>
      <h3>Total Milk: {calculateTotalMilk()} litres</h3>
      <h3>Total Price: ₹{calculateTotalPrice()}</h3>
      <button onClick={generatePDF}>Generate Report</button>
    </div>
  );
}

export default App;
