-- Sample data insert script for ProductsApiDb
-- Matches categories/products shown in the UI mockup.

SET IDENTITY_INSERT [Categories] ON;

INSERT INTO [Categories] ([Id], [Name]) VALUES
(1, N'בשר'),
(2, N'חלב וגבינות'),
(3, N'טואלטיקה'),
(4, N'ירקות ופירות');

SET IDENTITY_INSERT [Categories] OFF;

SET IDENTITY_INSERT [Products] ON;

INSERT INTO [Products] ([Id], [Name], [Price], [CategoryId]) VALUES
(1, N'נקניקיות', 24.90, 1),
(2, N'שוקיים', 19.90, 1),
(3, N'סלמון', 49.90, 1),
(4, N'קוטג''', 6.90, 2),
(5, N'חלב 3%', 5.50, 2),
(6, N'שמנת חמוצה', 7.90, 2);

SET IDENTITY_INSERT [Products] OFF;
