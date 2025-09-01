import React,{ useEffect, useState}from "react";
import api from "../../services/api";
import { parseErrorBarsOfAxis } from "recharts/types/util/ChartUtils";

function parseClinteXml(xmlString) {

  const doc = new window.DOMParser().parseFromString(xmlString, "application/xml");

  const parseError = doc.getElementsByTagName("parsererror")[0];
  if (parseError) {
    throw new Error("Erro ao analisar XML: " + parseError.textContent);
  }

  const items = Array.from(doc.getElementsByTagName("item"));
  const getText = (parent, tag) => {
    parent.getElementsByTagName(tag)[0]?.textContent.trim() ?? "";
    return items.map((item) => ({
      id: getText(item, "id"),
      clienteNome: getText(item, "clienteNome"),
      clienteCnpj: getText(item, "clienteCnpj"),
      clientEmail: getText(item, "clientemail"), 
      clienteTelefone: getText(item, "clienteTelefone"), 
      clienteCelular: getText(item, "clienteCelular"),
      createdAt: getText(item, "createdAt"),0
    }));
} 

export default function ClienteForm() { 
  return <div>ClienteForm</div>;
}