import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";

const sections = [
	{
		id: "problemas-ambientales",
		label: "Problemas Ambientales",
		icon: "alert-triangle",
	},
	{
		id: "guia-reportes-sostenibilidad",
		label: "Reportes Sostenibilidad",
		icon: "clipboard",
	},
	{
		id: "componentes-socioambientales",
		label: "Componentes Socioambientales",
		icon: "users",
	},
	{
		id: "amenazas-impactos-aspectos",
		label: "Amenazas e Impactos",
		icon: "zap",
	},
	{
		id: "consumo-responsable",
		label: "Consumo Responsable",
		icon: "shopping-cart",
	},
	{
		id: "uso-agua",
		label: "Uso del Agua",
		icon: "droplet",
	},
	{
		id: "uso-energia",
		label: "Uso de Energía",
		icon: "activity",
	},
];

const ConceptSidebarNav = () => {
	const [active, setActive] = useState(sections[0].id);
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const checkDark = () => {
			const theme = document.body.getAttribute("data-bs-theme");
			const isDark =
				theme === "dark" ||
				(!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
			setDark(isDark);
		};
		checkDark();
		window.addEventListener("storage", checkDark);
		const observer = new MutationObserver(checkDark);
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["data-bs-theme"],
		});
		return () => {
			window.removeEventListener("storage", checkDark);
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			let found = sections[0].id;
			for (const sec of sections) {
				const el = document.getElementById(sec.id);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= 120) found = sec.id;
				}
			}
			setActive(found);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollTo = (id) => {
		const el = document.getElementById(id);
		if (el) {
			window.scrollTo({
				top: el.getBoundingClientRect().top + window.scrollY - 80,
				behavior: "smooth",
			});
		}
	};

	return (
		<>
			<style>{`
  @media (max-width: 991.98px) {
    .concept-sidebar-nav-responsive {
      display: none !important;
    }
  }
`}</style>
			<nav
				className="d-none d-md-flex concept-sidebar-nav-responsive"
				style={{
					position: "fixed",
					top: 110,
					right: 32,
					zIndex: 1000,
					background: dark ? "#1a232a" : "#f6fff7",
					borderRadius: 16,
					boxShadow: dark ? "0 2px 8px #111b22cc" : "0 2px 6px #b7e4c7cc",
					padding: "16px 10px",
					minWidth: 64,
					display: "flex",
					flexDirection: "column",
					gap: 16,
					alignItems: "center",
					border: dark ? "1.5px solid #26323a" : "1.5px solid #e0f2f1",
				}}
				aria-label="Navegación de conceptos"
			>
				{sections.map((sec) => (
					<button
						key={sec.id}
						onClick={() => scrollTo(sec.id)}
						style={{
							background:
								active === sec.id
									? dark
										? "#232f38"
										: "#e0f2f1"
									: dark
									? "#1a232a"
									: "#f6fff7",
							color: dark
								? active === sec.id
									? "#b7e4c7"
									: "#b7e4c7cc"
								: active === sec.id
								? "#1b5e20"
								: "#388e3c",
							border: active === sec.id
								? dark
									? "2px solid #b7e4c7"
									: "2px solid #43a047"
								: dark
								? "1.2px solid #26323a"
								: "1.2px solid #e0f2f1",
							borderRadius: 12,
							width: 170,
							height: 70,
							fontWeight: 600,
							fontSize: 15,
							boxShadow:
								active === sec.id
									? dark
										? "0 1px 4px #111b22cc"
										: "0 1px 4px #b7e4c7"
									: "none",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							outline: "none",
							transition: "all 0.18s",
							margin: 0,
						}}
						aria-current={active === sec.id ? "section" : undefined}
						aria-label={sec.label}
					>
						<FeatherIcon
							icon={sec.icon}
							size={22}
							style={{
								marginBottom: 4,
								color: dark
									? active === sec.id
										? "#b7e4c7"
										: "#b7e4c7cc"
									: undefined,
							}}
						/>
						<span style={{ fontSize: 13, fontWeight: 600 }}>
							{sec.label}
						</span>
					</button>
				))}
			</nav>
		</>
	);
};

export default ConceptSidebarNav;
