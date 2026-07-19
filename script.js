// الرابط الجديد الفعال والمحدث الخاص بك
const API_URL = "https://script.google.com/macros/s/AKfycbxGMvWnD_3vlG9HjaBrVdRWAKx6PeX5jWyltoqn0yjtvqAla3Zal9xrxqFeAtyUqesl/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let students = await response.json();

        // 1. فرز وترتيب الطلاب حسب الدرجة الأعلى أولاً
        students.sort((a, b) => b.score - a.score);

        // 2. استثناء خاص: ترتيب القائمة لتبدأ دائماً بالطالبة Janah Amr بناءً على طلبك
        students.sort((a, b) => {
            if (a.name.toString().trim().toLowerCase() === "janah amr") return -1;
            if (b.name.toString().trim().toLowerCase() === "janah amr") return 1;
            return 0; 
        });

        // 3. تحديث منصة الأوائل المميزة بالأسماء والدرجات المظبوطة
        if (students.length >= 1) {
            document.getElementById("firstName").textContent = students[0].name;
            document.getElementById("firstScore").textContent = students[0].score + " / 30";
        }
        if (students.length >= 2) {
            document.getElementById("secondName").textContent = students[1].name;
            document.getElementById("secondScore").textContent = students[1].score + " / 30";
        }
        if (students.length >= 3) {
            document.getElementById("thirdName").textContent = students[2].name;
            document.getElementById("thirdScore").textContent = students[2].score + " / 30";
        }

        // 4. بناء الجدول بالكامل
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        students.forEach((student, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td><span class="rank-badge">${index + 1}</span></td>
                    <td style="font-weight: 600;">${student.name}</td>
                    <td style="color: #ffd700; font-weight: bold;">${student.score} / 30</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// كود البحث الفوري الذكي
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();
    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

// التشغيل التلقائي عند فتح الصفحة
loadData();
// تحديث تلقائي كل دقيقة لمزامنة الدرجات الجديدة
setInterval(loadData, 60000);
